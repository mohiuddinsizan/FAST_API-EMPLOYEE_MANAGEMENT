import React from 'react';
import ReactDOM from 'react-dom/client';  // Notice the change here
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using the new API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
