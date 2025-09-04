import React from 'react';
import {
  //BrowserRouter,
  HashRouter
} from 'react-router-dom';
import App from './App';
import { MainProvider } from "./contexts/MainContext";
// Get the container element
const rootElement = document.getElementById('mos-faqs-settings-react-app');

// Check if the root element exists before rendering
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root
  root.render(
    <HashRouter>
        <MainProvider>
            <App />
        </MainProvider>
    </HashRouter>
  ); // Render the App component
} else {
  console.error("Target container '#mos-faqs-settings-react-app' not found in the DOM.");
}
