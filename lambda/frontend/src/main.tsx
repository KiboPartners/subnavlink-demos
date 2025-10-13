import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const orderData = (window as any).__ORDER_DATA__;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App order={orderData}/>
  </React.StrictMode>
);
