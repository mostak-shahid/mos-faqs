import React from 'react';
import App from './App';

// Get the container element
const rootElement = document.getElementById('mos-faqs-settings-react-app');

// Check if the root element exists before rendering
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ); // Render the App component
} else {
  console.error("Target container '#mos-faqs-settings-react-app' not found in the DOM.");
}
