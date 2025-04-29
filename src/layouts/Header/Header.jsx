import { __ } from "@wordpress/i18n";
import React, { useState } from 'react';
import { Button, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Details from '../../data/details.json';
export default function Header() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <div className="top-bar bd-gray-800 text-white py-2">
                <div className="text-center">{__( `Unlock ${Details?.name}'s Full Potential!Get exclusive features and unbeatable performance.Upgrade now`, "mos-faqs" )}</div>
            </div>

            <Navbar bg="light" variant="light" expand="lg" className="bg-white border-bottom sticky-top">
                <div className="container-fluid">
                    <Navbar.Brand href="#home" href="/">Mos FAQs</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item mb-0">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item mb-0">
                                <Link to="/settings" className="nav-link">Settings</Link>
                            </li>
                            <li className="nav-item mb-0">
                                <Link to="/contact" className="nav-link">Contact</Link>
                            </li>
                            <NavDropdown title="More" id="basic-nav-dropdown">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </NavDropdown>
                            <li className="nav-item mb-0">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                            </li>
                            <li><Button variant="primary" onClick={handleShow}>
        Open Menu
      </Button></li>
                        </Nav>
                        <Nav className="navbar-nav mb-2 mb-lg-0">
                            
                            <NavDropdown title="Free" id="basic-nav-dropdown">
                                <li><a className="dropdown-item" href="#">Version</a></li>
                                <li><a className="dropdown-item" href="#">{Details?.name} <span>Core</span></a></li>
                            </NavDropdown>
                        </Nav>
                        
                    </Navbar.Collapse>
                </div>
            </Navbar>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <p>This is an offcanvas sidebar. Add your nav links or content here.</p>
                <Button variant="outline-secondary" onClick={handleClose}>
                    Close
                </Button>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
