import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import ThemeToggle from '../ButtonThemeToggle/ThemeToggle.jsx';
import AuthContext from '../../context/Auth/AuthContext.jsx';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  // Obtener iniciales del usuario
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <span className={styles.logo}>CHACO BARBER</span>
      </div>

      {/* Botón Hamburguesa para Mobile */}
      <button className={styles.hamburger} onClick={toggleMenu}>
        ☰
      </button>

      {/* Links de Navegación */}
      <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
        <li><a href="/">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#misturnos">Mis Turnos</a></li>
        <li><a href="#team">Team</a></li>
        <li><a href="#booking">Booking</a></li>
        <li><a href="#contact">Contact</a></li>
        {isAuthenticated && <li><a href="#misturnos">Mis Turnos</a></li>}
      </ul>

      {/* Acciones: Dark Mode, Avatar y Perfil */}
      <div className={styles.actions}>
        <ThemeToggle />

        {isAuthenticated && (
          <div className={styles.profileContainer}>
            {/* Avatar */}
            <button
              className={styles.avatarButton}
              onClick={toggleProfileDropdown}
              title={user?.name}
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className={styles.profileImage} />
              ) : (
                <span className={styles.avatarInitials}>{getInitials()}</span>
              )}
            </button>

            {/* Dropdown Menú */}
            {isProfileDropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <strong>{user?.name}</strong>
                  <p>{user?.email}</p>
                </div>
                <hr />
                <button className={styles.dropdownItem}>
                  👤 Mi Perfil
                </button>
                <button className={styles.dropdownItem} onClick={handleLogout}>
                  🚪 Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
