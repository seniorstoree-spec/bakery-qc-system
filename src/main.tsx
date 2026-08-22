import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './desktop-responsive.css';
import { installGlobalInputNormalization } from './utils/normalizeDigits';

installGlobalInputNormalization();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
