import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar'; 
import Home from './pages/home'; 
function App() {
  return (
    <div>
      <Navbar /> {/* ✅ Navbar is now at the top of all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
