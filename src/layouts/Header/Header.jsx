import { __ } from "@wordpress/i18n";
import { useState } from 'react';
import { Button, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { Link, NavLink } from "react-router-dom";
import logo from '../../assets/images/logo.svg';
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
            {/* <div className="top-bar bd-gray-800 text-white py-2">
                <div className="text-center">{__( `Unlock ${Details?.name}'s Full Potential!Get exclusive features and unbeatable performance.Upgrade now`, "mos-faqs" )}</div>
            </div> */}

            <Navbar expanded={expanded} onToggle={setExpanded} bg="light" variant="light" expand="lg" className="bg-white border-bottom sticky-top">
                <div className="container-fluid">
                    <Navbar.Brand href="#/" className="p-0">
                        <div className="d-flex align-items-center gap-2">
                            <img src={logo} alt="" />
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="navbar-nav me-auto mb-2 mb-lg-0">
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
                        {/* <Nav className="navbar-nav-left navbar-nav me-auto mb-2 mb-lg-0">
                            <Nav.Link as={NavLink} to="/" end onClick={handleNavClick}>
                                {__( 'Home', "mos-faqs" )}
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/explore" end onClick={handleNavClick}>
                                {__( 'Explore', "mos-faqs" )}
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/settings" onClick={handleNavClick}>
                                {__( 'Settings', "mos-faqs" )}
                            </Nav.Link>
                            <div className="d-block d-lg-none">
                            <NavDropdown title="Settings">
                                <li><Link to="/settings/buy_together" className="dropdown-item" onClick={handleNavClick}>{__( 'Buy Together', "mos-faqs" )}</Link></li>
                                <li><Link to="/settings/product_addons" className="dropdown-item" onClick={handleNavClick}>{__( 'Product Addons', "mos-faqs" )}</Link></li>
                                <li><Link to="/settings/product_badge" className="dropdown-item" onClick={handleNavClick}>{__( 'Product Badge', "mos-faqs" )}</Link></li>
                            </NavDropdown>
                            </div>
                        </Nav> */}
                        <Nav className="mavbar-nav-right navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link disabled" aria-disabled="true">{Details?.version} {__( 'Core', "mos-faqs" )}</a>
                            </li>
                            <li className="nav-item">
                                <a href="https://wordpress.org/support/plugin/mos-faqs/" target="_blank" className="nav-link" title={__( 'Documentation', "mos-faqs" )}><span class="dashicons dashicons-editor-help d-none d-lg-inline"></span><span className="d-lg-none">{__( 'Documentation', "mos-faqs" )}</span></a>
                            </li>
                            <li className="nav-item">
                                <a href="https://wordpress.org/support/plugin/mos-faqs/reviews/#new-post"  target="_blank" className="nav-link" title={__( 'Knowledge Base', "mos-faqs" )}><span class="dashicons dashicons-book d-none d-lg-inline"></span><span className="d-lg-none">{__( 'Knowledge Base', "mos-faqs" )}</span></a>
                            </li>
                            <li className="nav-item" onClick={handleShow}>
                                <a className="nav-link" title={__( 'What\'s New', "mos-faqs" )}><span class="dashicons dashicons-megaphone d-none d-lg-inline"></span><span className="d-lg-none">{__( 'What\'s New', "mos-faqs" )}</span></a>
                            </li>
                            {/* <NavDropdown 
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
                            </NavDropdown> */}
                        </Nav>
                        
                    </Navbar.Collapse>
                </div>
            </Navbar>

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>{__( 'What\'s New', "mos-faqs" )}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <p>{__( 'Loading...', "mos-faqs" )}</p>
                <Button variant="outline-secondary" onClick={handleClose}>
                    {__( 'Close', "mos-faqs" )}
                </Button>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
