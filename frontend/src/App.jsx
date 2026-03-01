import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NotesPage from './pages/NotesPage'
function App() {
  
  return (
    <div className="App">
      <h1>Mi App de Notas.</h1>
      <NotesPage />
    </div>
  )
}

export default App
