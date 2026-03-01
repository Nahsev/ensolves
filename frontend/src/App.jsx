import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';
import './App.css'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/:username" element={<NotesPage/>} /> 


      </Routes>
    </Router>
  );
}

export default App
