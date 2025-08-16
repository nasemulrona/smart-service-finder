import React, { useState } from 'react';
import styles from './App.module.css';

const App: React.FC = () => {
  const [navbarMenuOpen, setNavbarMenuOpen] = useState(false);
  const [findServicesOpen, setFindServicesOpen] = useState(false);

  const toggleNavbarMenu = () => setNavbarMenuOpen(!navbarMenuOpen);
  const toggleFindServices = () => setFindServicesOpen(!findServicesOpen);

  return (
    <div className={styles.container}>
      {/* Emergency Banner */}
      <div className={styles.emergencyBanner}>
        <span>🚨 Emergency Service Needed?</span>
        <button>Call Now 01758101881</button>
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>Smart Service Finder</div>

        <div className={styles.navRight}>
          <ul>
            <li>About</li>
            <li>News</li>
            <li>Find Local Services</li>
            <li onClick={toggleFindServices} className={styles.findServicesBtn}>
              Find Services ▾
              {findServicesOpen && (
                <div className={styles.findServicesDropdown}>
                  <ul>
                    <li>Plumbing</li>
                    <li>Electrical</li>
                    <li>AC Repair</li>
                    <li>Cleaning</li>
                    <li>Security</li>
                    <li>Painting</li>
                    <li>Bathroom</li>
                    <li>Heating</li>
                  </ul>
                </div>
              )}
            </li>
            <li>Sign Up</li>
            <li>Log In</li>
          </ul>
        </div>

        <div className={styles.menuIcon} onClick={toggleNavbarMenu}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>

        {navbarMenuOpen && (
          <div className={styles.dropdown}>
            <ul>
              <li>About</li>
              <li>News</li>
              <li>Services</li>
              <li>Find Local Services</li>
              <li onClick={toggleFindServices}>Find Services</li>
              <li>Sign Up</li>
              <li>Log In</li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <h1>Looking for a reliable service?</h1>
        <p>Smart Service Finder connects you with trusted professionals for all your home service needs.</p>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search for a service..." />
          <button>Search</button>
        </div>
      </header>

      {/* Promo Banner */}
      <div className={styles.promoBanner}>
        <p>🎉 Eid Special: 20% off on Home Cleaning!</p>
      </div>

      {/* Service Description Section */}
      <section className={styles.aboutSection}>
        <h2>Our Services</h2>
        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.liveBadge}>🔴 12 Available Now</div>
            <img src="/images/Plumber.png" alt="Plumbing Service" className={styles.serviceImage} />
            <h3>Plumbing</h3>
            <div className={styles.rating}>★★★★★ (128 reviews)</div>
            <p>Expert plumbing services for leaks, installations, and emergencies from certified professionals.</p>
            <button className={styles.bookButton}>Book Now</button>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.liveBadge}>🔴 8 Available Now</div>
            <img src="/images/electrical.png" alt="Electrical Service" className={styles.serviceImage} />
            <h3>Electrical</h3>
            <div className={styles.rating}>★★★★☆ (96 reviews)</div>
            <p>Certified electricians for wiring, repairs, and safety checks with guaranteed quality work.</p>
            <button className={styles.bookButton}>Book Now</button>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.liveBadge}>🔴 15 Available Now</div>
            <img src="/images/homecleaning.png" alt="Home Cleaning Service" className={styles.serviceImage} />
            <h3>Home Cleaning</h3>
            <div className={styles.rating}>★★★★★ (215 reviews)</div>
            <p>Thorough home cleaning services including carpets, sofas, and complete bathroom sanitation.</p>
            <button className={styles.bookButton}>Book Now</button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.stepsSection}>
        <h2>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.stepBox}>
            <div className={styles.stepNumber}>1</div>
            <h3>Search for your services</h3>
            <p>Find the exact service you need from our comprehensive list of professionals.</p>
          </div>
          <div className={styles.stepBox}>
            <div className={styles.stepNumber}>2</div>
            <h3>Review the list of Providers</h3>
            <p>Compare ratings, prices, and availability of service providers in your area.</p>
          </div>
          <div className={styles.stepBox}>
            <div className={styles.stepNumber}>3</div>
            <h3>Request a quote</h3>
            <p>Contact providers directly or request quotes through our platform.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem}>
            <h3>How do I pay for services?</h3>
            <p>We accept bKash, Nagad, and cash payments. Payment methods are selected when booking.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Are your providers verified?</h3>
            <p>Yes, all providers go through our strict verification process including background checks.</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className={styles.aboutUs}>
        <h2>What is Smart Service Finder?</h2>
        <p>
          Smart Service Finder is a platform dedicated to connecting homeowners with reliable service professionals. 
          We vet all our service providers to ensure quality and reliability, saving you time and giving you peace of mind.
        </p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerColumns}>
          <div className={styles.footerColumn}>
            <h3>Homeowners</h3>
            <ul>
              <li>How it works</li>
              <li>Our services</li>
              <li>FAQs</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>Service Providers</h3>
            <ul>
              <li>How much to join?</li>
              <li>Sign up to Smart Service Finder</li>
              <li>How it works</li>
              <li>Our Listings</li>
              <li>FAQs</li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h3>Get in touch</h3>
            <p>01758101881</p>
            <p>nasemulrona0661@gmail.com</p>
          </div>
          <div className={styles.footerColumn}>
            <h3>Find a Service today!</h3>
            <button className={styles.footerButton}>Search now</button>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© Smart Service Finder 2025 - All Rights Reserved</p>
          <p>Design by nasemulrona</p>
        </div>
      </footer>
    </div>
  );
};

export default App;