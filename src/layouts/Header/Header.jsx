import React from 'react';
import { Link } from "react-router-dom";
export default function Header() {
    return (
        <div>
            <ul> 
                <li>
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/settings" className="hover:underline">Settings</Link>
                <Link to="/contact" className="hover:underline">Contact</Link>
                </li>
            </ul>
        </div>
    )
}
