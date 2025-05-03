import { __ } from "@wordpress/i18n";
import React, { useState } from 'react';
import { Button, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from "react-router-dom";
import Details from '../../data/details.json';

export default function Header() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [expanded, setExpanded] = useState(false);

    const handleNavClick = () => {
      setExpanded(false); // Close menu on link click
    };
    return (
        <>
            <div className="top-bar bd-gray-800 text-white py-2">
                <div className="text-center">{__( `Unlock ${Details?.name}'s Full Potential!Get exclusive features and unbeatable performance.Upgrade now`, "mos-faqs" )}</div>
            </div>

            <Navbar expanded={expanded} onToggle={setExpanded} bg="light" variant="light" expand="lg" className="bg-white border-bottom sticky-top">
                <div className="container-fluid">
                    <Navbar.Brand href="#home" href="/">Mos FAQs</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link" onClick={handleNavClick}>Home</Link>
                            </li>
                            <li className="nav-item d-none d-lg-block">
                                <Link to="/settings" className="nav-link" onClick={handleNavClick}>Settings</Link>
                            </li>
                            <Nav.Link as={NavLink} to="/" end onClick={handleNavClick}>
                                Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/settings" onClick={handleNavClick}>
                                Settings
                            </Nav.Link>
                            <div className="d-block d-lg-none">
                            <NavDropdown title="Settings">
                                <li><Link to="/settings/basic" className="dropdown-item" onClick={handleNavClick}>Basic</Link></li>
                                <li><Link to="/settings/advanced" className="dropdown-item" onClick={handleNavClick}>Advanced</Link></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </NavDropdown>
                            </div>
                            <li className="nav-item">
                                <Link to="/page" className="nav-link">Contact</Link>
                            </li>

                            <NavDropdown title="More">
                                <Nav.Link as={NavLink} to="/" end onClick={handleNavClick}>
                                    Home
                                </Nav.Link>
                                <Nav.Link as={NavLink} to="/settings" onClick={handleNavClick}>
                                    Settings
                                </Nav.Link>
                            </NavDropdown>
                            <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                            </li>
                        </Nav>
                        <Nav className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link disabled" aria-disabled="true">{Details?.version} Core</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" title="Documentation"><span class="dashicons dashicons-editor-help d-none d-lg-inline"></span><span className="d-lg-none">Documentation</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" title="Knowledge Base"><span class="dashicons dashicons-book d-none d-lg-inline"></span><span className="d-lg-none">Knowledge Base</span></a>
                            </li>
                            <li className="nav-item" onClick={handleShow}>
                                <a className="nav-link" title="What's New"><span class="dashicons dashicons-megaphone d-none d-lg-inline"></span><span className="d-lg-none">What's New</span></a>
                            </li>
                            <NavDropdown 
                                title={
                                    <span>
                                    <i className="dashicons dashicons-admin-users d-none d-lg-inline"></i>
                                    <span className="d-lg-none">Account</span>
                                    </span>
                                } 
                                
                                align="end"
                            >
                                <li><a className="dropdown-item" href="#">License Status <span>Inactive</span></a></li>
                                <li><a className="dropdown-item" href="#">Manage Plan</a></li>
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
