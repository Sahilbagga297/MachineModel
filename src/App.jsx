import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage  from './Pages/Homepage.jsx';
import Dashboard from './Pages/Dashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Homepage />}  />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
