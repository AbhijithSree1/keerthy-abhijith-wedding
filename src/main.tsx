import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import WeddingSite from './WeddingSite';
import LinkGenerator from './LinkGenerator';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<WeddingSite />} />
        <Route path="/invite" element={<LinkGenerator />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
