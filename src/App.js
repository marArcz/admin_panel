import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import React, { useEffect } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from './Home';
import Login from './Login'
import { useNavigate } from 'react-router-dom';
// import { decode } from 'base64-arraybuffer'

function App() {

  const navigate = useNavigate();
    

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </div>
  );
}

export default App;
