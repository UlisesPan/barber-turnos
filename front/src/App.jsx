import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import SplashScreen from './components/SplashScreen/SplashScreen.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import Home from './views/Home/Home.jsx';
import Login from './views/Login/Login.jsx';
import Register from './views/Register/Register.jsx';
import Servicios from './views/Servicios/Servicios.jsx';
import MyAppointments from './views/MyAppointments/MyAppointments.jsx';
import ManageServices from './views/ManageServices/ManageServices.jsx';
import ReserveAppointments from './views/ReserveAppointments/ReserveAppointments.jsx';
import Contact from './views/Contact/Contact.jsx';

const SPLASH_KEY = 'splashSeen';

// El splash se muestra una sola vez por sesión y nunca con "reducir movimiento" activado
const shouldShowSplash = () => {
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem(SPLASH_KEY);
  } catch {
    return false;
  }
};

function App() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);

  const handleSplashFinish = () => {
    try { sessionStorage.setItem(SPLASH_KEY, '1'); } catch { /* ignorar */ }
    setShowSplash(false);
  };

  if (showSplash) return <SplashScreen onFinish={handleSplashFinish} />;

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reserve" element={<ReserveAppointments />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route
            path="/servicios/gestionar"
            element={<ProtectedRoute adminOnly><ManageServices /></ProtectedRoute>}
          />
          <Route path="/turnos" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
