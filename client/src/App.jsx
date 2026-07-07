import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import routes from './routes';
import './styles/global.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1200);
    const fadeTimer = window.setTimeout(() => setSplashVisible(false), 1400);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(fadeTimer);
    };
  }, []);

  if (splashVisible) {
    return (
      <div className={`splash-screen ${showSplash ? 'splash-active' : 'splash-inactive'}`}>
        <div className="splash-card">
          <div className="splash-logo">V</div>
          <h1>VulnGuard</h1>
          <p>Starting security scan dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main>{routes}</main>
      </div>
    </BrowserRouter>
  );
}
