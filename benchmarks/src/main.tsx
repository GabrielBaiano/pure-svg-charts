import React from 'react';
import ReactDOM from 'react-dom/client';
import { BenchmarkApp } from './BenchmarkApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BenchmarkApp />
  </React.StrictMode>
);
