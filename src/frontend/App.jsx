import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';

const bgVideo = import.meta.env.VITE_BG_VIDEO_URL;

function App() {
  return (
    <div className="app-container">
      <div className="bg-layer">
        <video className="bg-video" src={bgVideo} autoPlay loop muted playsInline />
      </div>
      <div className="content">
        <header className="header">
          <div className="logo">Logo</div>
          <nav className="nav">
            <a href="#curiosidades">Curiosidades</a>
            <a href="#asteroides">Asteroides</a>
            <a href="#sobre-nos">Sobre nós</a>
          </nav>
        </header>
        <main className="main-content">
          <h1>Acenda sua curiosidade, <br /> Amplie seu universo!</h1>
          <button className="cta-button">Conheça mais</button>
        </main>
      </div>
    </div>
  );
}

export default App;
