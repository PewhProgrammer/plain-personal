import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Album from './components/Album'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>📷 Photo Sharing</h1>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/albums/:albumId" element={<Album />} />
      </Routes>
    </div>
  )
}

export default App
