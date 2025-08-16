from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:2272@localhost:5432/service_finder")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Auth Utilities ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"  # Generate with: openssl rand -hex 32
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Models ---
class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    description = Column(String, nullable=True)
    available = Column(Boolean, default=True)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    price = Column(Float, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    phone = Column(String, unique=True)
    is_active = Column(Boolean, default=True)

Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas ---
class ServiceCategory(str, Enum):
    plumbing = "plumbing"
    electrical = "electrical"
    cleaning = "cleaning"
    tutoring = "tutoring"
    other = "other"

class ServiceBase(BaseModel):
    name: str
    category: ServiceCategory
    description: Optional[str] = None
    available: bool = True
    rating: float = 0.0
    reviews_count: int = 0
    price: Optional[float] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int
    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# --- FastAPI App ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ======================
# Authentication Routes
# ======================
@app.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    return {"message": "This is a protected route"}

# =================
# Service Routes
# =================
@app.get("/api/services", response_model=List[ServiceResponse])
def get_services(
    category: Optional[str] = None,
    available: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Service)
    if category:
        query = query.filter(Service.category == category)
    if available is not None:
        query = query.filter(Service.available == available)
    return query.all()

@app.post("/api/services", response_model=ServiceResponse)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.get("/api/services/categories")
def get_categories():
    return [category.value for category in ServiceCategory]

# ======================
# Initial Data Setup
# ======================
@app.on_event("startup")
def startup_populate_db():
    db = SessionLocal()
    
    # Sample services
    if not db.query(Service).first():
        sample_services = [
            Service(
                name="Plumbing Services",
                category="plumbing",
                description="24/7 emergency plumbing",
                available=True,
                rating=4.5,
                price=75.0
            ),
            Service(
                name="Electrical Repairs",
                category="electrical",
                available=False,
                rating=4.8,
                price=65.0
            )
        ]
        db.add_all(sample_services)
    
    # Test user
    if not db.query(User).first():
        test_user = User(
            email="test@example.com",
            hashed_password=get_password_hash("password123"),
            full_name="Test User",
            phone="+1234567890"
        )
        db.add(test_user)
    
    db.commit()
    db.close()