
import { useState } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import SplashScreen from './components/SplashScreen/SplashScreen.jsx';
import Home from './views/Home/Home.jsx';
import Login from './views/Login/Login.jsx';
import Register from './views/Register/Register.jsx';
import Servicios from './views/Servicios/Servicios.jsx';
import MyAppointments from './views/MyAppointments/MyAppointments.jsx';
import ManageServices from './views/ManageServices/ManageServices.jsx';
import ReserveAppointments from './views/ReserveAppointments/ReserveAppointments.jsx';
import Contact from './views/Contact/Contact.jsx';
import Footer from './components/Footer/Footer.jsx';
function AppContent() {


  return (
    <>
       <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reserve" element={< ReserveAppointments/>} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicios/gestionar" element={<ManageServices />} />
        <Route path="/turnos" element={<MyAppointments />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer/>
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return <AppContent />;
}

export default App;
