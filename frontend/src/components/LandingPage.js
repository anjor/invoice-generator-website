import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaFileInvoiceDollar, FaCloudDownloadAlt, FaUserClock, FaStar, FaEllipsisH } from 'react-icons/fa';

function LandingPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitted(false);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/join_waitlist`,
                { email: email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setIsSubmitted(true);
                setEmail('');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('This email is already on the waitlist or is invalid.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="landing-page">
            <header className="hero">
                <div className="hero-content">
                    <h1>Easy Invoice Generator</h1>
                    <p>Create professional invoices in seconds - 100% Free!</p>
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
            <section className="upcoming-features">
                <h2>Exciting Features Coming Soon!</h2>
                <div className="feature-grid">
                    <div className="feature">
                        <FaStar className="feature-icon" />
                        <h3>Save Clients</h3>
                        <p>Store client information for quick and easy invoice creation</p>
                    </div>
                    <div className="feature">
                        <FaStar className="feature-icon" />
                        <h3>Recurring Invoices</h3>
                        <p>Set up automatic recurring invoices for regular billing</p>
                    </div>
                    <div className="feature">
                        <FaStar className="feature-icon" />
                        <h3>Invoice Tracking</h3>
                        <p>Keep track of paid, unpaid, and overdue invoices</p>
                    </div>
                    <div className="feature">
                        <FaEllipsisH className="feature-icon" />
                        <h3>And Many More</h3>
                        <p>We're constantly working on new features to improve your experience</p>
                    </div>
                </div>
            </section>
            <section className="waitlist">
                <h2>Join Our Waitlist</h2>
                <p>Sign up early and get a discounted price when we launch our premium features!</p>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <button type="submit">Join Waitlist</button>
                    </form>
                ) : (
                    <p className="success-message">Thanks for joining! We'll keep you updated.</p>
                )}
                {error && <p className="error-message">{error}</p>}
            </section>
        </div>
    );
}

export default LandingPage;
