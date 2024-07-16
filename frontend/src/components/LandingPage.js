import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileInvoiceDollar, FaCloudDownloadAlt, FaUserClock } from 'react-icons/fa';

function LandingPage() {
    return (
        <div className="landing-page">
            <header className="hero">
                <div className="hero-content">
                    <h1>Easy Invoice Generator</h1>
                    <p>Create professional invoices in seconds</p>
                    <Link to="/generator" className="cta-button">Get Started</Link>
                </div>
            </header>
            <section className="features">
                <div className="feature">
                    <FaFileInvoiceDollar className="feature-icon" />
                    <h2>Professional Invoices</h2>
                    <p>Generate clean, professional-looking invoices with ease</p>
                </div>
                <div className="feature">
                    <FaCloudDownloadAlt className="feature-icon" />
                    <h2>Instant Download</h2>
                    <p>Download your invoice as a PDF immediately after generation</p>
                </div>
                <div className="feature">
                    <FaUserClock className="feature-icon" />
                    <h2>Time-Saving</h2>
                    <p>Streamline your invoicing process and save valuable time</p>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
