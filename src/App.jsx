import apiFetch from '@wordpress/api-fetch';
import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from 'react';
import "./App.css";
import Header from './layouts/Header/Header';
// import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Loading from './pages/Loading/Loading';
import Settings from './pages/Settings/Settings';
const NotFound = () => (
  <div>
      <h2>{__( "404 - Page Not Found", "mos-faqs" )}</h2>
      <p>{__( "The page you are looking for does not exist.", "mos-faqs" )}</p>
      <Link to="/">{__( "Go back to Home", "mos-faqs" )}</Link>
  </div>
);
function App() {
  const [settingLoading, setSettingLoading] = useState(true);
  const [settingData, setSettingData] = useState({});
  
  const OPTIONS_API_URL = "/mos-faqs/v1/options"; // No /wp-json here, apiFetch adds it
  //const isChecked = checked === "1" || checked === true || checked === 1;
  useEffect(() => {
    const fetchSettingData = async () => {
        try {
            const data = await apiFetch({ path: OPTIONS_API_URL });
            setSettingData(data);
            setSettingLoading(false);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };    
    fetchSettingData();
  }, []);

  return (
    <>
    {
      !settingLoading ? 
      <>
      <div className="mos-faqs-settings-container">
        <Header />
        <Routes>
            {/* <Route path="/" element={<RestrictionsSettings handleChange={handleChange} />} /> */}
            {/* <Route path="/"  element={<Navigate to="/restrictions/settings" />} /> */}
            <Route path="/"  element={<Dashboard/>} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      </> :
      <Loading />
    }
    {/* {console.log(settingData)}     */}
    </>
  );
}

export default App;