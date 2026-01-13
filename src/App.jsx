import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Journal from './components/Journal';
import BibleReader from './components/BibleReader';
import Favorites from './components/Favorites';
import Settings from './components/Settings';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendrier" element={<Calendar />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/bible" element={<BibleReader />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
