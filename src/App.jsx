import { __ } from "@wordpress/i18n";
import React from "react";
import "./App.css";
import Header from "./layouts/Header/Header";
// import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, Route, Routes } from "react-router-dom";
import ArrayInput from "./pages/ArrayInput";
import BaseInput from "./pages/BaseInput";
import Dashboard from "./pages/Dashboard/Dashboard";
import Page from "./pages/Page";
import Settings from "./pages/Settings/Settings";
const NotFound = () => (
  <div>
    <h2>{__("404 - Page Not Found", "mos-faqs")}</h2>
    <p>{__("The page you are looking for does not exist.", "mos-faqs")}</p>
    <Link to="/">{__("Go back to Home", "mos-faqs")}</Link>
  </div>
);
function App() {

  return (
    <div className="mos-faqs-settings-container">
      <Header />
      <Routes>
        {/* <Route path="/" element={<RestrictionsSettings handleChange={handleChange} />} /> */}
        {/* <Route path="/"  element={<Navigate to="/restrictions/settings" />} /> */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/basic" element={<Settings />} />
        <Route path="/settings/advanced" element={<Settings />} />
        <Route path="/settings/base_input" element={<BaseInput />} />
        <Route path="/settings/array_input" element={<ArrayInput />} />
        <Route path="/page" element={<Page />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
