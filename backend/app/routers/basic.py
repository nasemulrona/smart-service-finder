from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root():
    return {"status": "API is working"}

@router.get("/dummy-services")
async def get_dummy_services():
    return {"services": [{"id": 1, "name": "Plumber"}]}