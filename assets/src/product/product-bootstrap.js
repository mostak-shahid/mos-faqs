import React from "react";
import { createRoot } from "react-dom/client";
import ProductApp from "./ProductApp";

import "../styles/tailwind.css";
// Profile-specific styles (create this file if you need page-specific CSS)
// import "./styles/product.css";

const container = document.getElementById("mos-faqs-product-react-app");

if (container) {
    const root = createRoot(container);
    root.render(<ProductApp />);
} else {
    console.error("Target container '#mos-faqs-product-react-app' not found in the DOM.");
}