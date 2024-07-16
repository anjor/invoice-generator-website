import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import LandingPage from './components/LandingPage';
import InvoiceGenerator from './components/InvoiceGenerator';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/">Easy Invoice</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/generator">Generate Invoice</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/generator" element={<InvoiceGenerator />} />
                </Routes>

                <footer className="footer">
                    <Container>
                        <p>&copy; 2023 Easy Invoice Generator. All rights reserved.</p>
                    </Container>
                </footer>
            </div>
        </Router>
    );
}

export default App;
