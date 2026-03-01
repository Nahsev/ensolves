import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};
import './App.css'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route
          path="/:username"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  );
}

export default App
