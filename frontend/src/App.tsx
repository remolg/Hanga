import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/register/Register';
import { Home } from './pages/home/Home';
import Login from './pages/Login/Login';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
