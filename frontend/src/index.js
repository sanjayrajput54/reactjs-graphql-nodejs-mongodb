import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from "react-cookie";
import SnackbarProvider from 'react-simple-snackbar'

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
    <SnackbarProvider>
    <App />
    </SnackbarProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();
