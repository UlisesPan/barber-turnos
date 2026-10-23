import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink, Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../context/Auth/AuthContext';
import ThemeToggle from '../ButtonThemeToggle/ThemeToggle.jsx';
import logoBarber from '/logo-barber-sm.png';
import { IconLogOut, IconCameraW } from '../Icons/Icons.jsx';
import useProfilePhotoUpload from '../../hooks/useProfilePhotoUpload';
import { photoUrl } from '../../api/axiosInstance';
import { getInitials } from '../../utils/format';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Turnos', href: '/turnos' },
  { label: 'Contacto', href: '/contact' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { fileInputRef, openPicker, handleFileChange, uploading } = useProfilePhotoUpload();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // Cierra menús al cambiar de ruta (ajuste de estado durante el render, sin efecto)
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }

  // Cierra el dropdown con click afuera o Escape
  useEffect(() => {
    if (!isProfileDropdownOpen) return;
    const onClick = (e) => {
      if (!profileRef.current?.contains(e.target)) setIsProfileDropdownOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setIsProfileDropdownOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.navWrapper}>
      <nav className={styles.navbar} aria-label="Principal">
        <div className={styles.logoContainer}>
          <Link to="/" aria-label="Chaco Barber — inicio">
            <img src={logoBarber} alt="Chaco Barber" className={styles.logo} />
          </Link>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul id="main-menu" className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) => (isActive ? styles.activeLink : '')}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {!isAuthenticated && (
            <Link to="/login" className={styles.loginBtn}>Ingresar</Link>
          )}
          <div className={styles.ThemeToggle}>
            <ThemeToggle />
          </div>

          {isAuthenticated && (
            <div className={styles.profileContainer} ref={profileRef}>
              <button
                className={styles.avatarButton}
                onClick={() => setIsProfileDropdownOpen((open) => !open)}
                aria-label={`Menú de ${user?.name ?? 'usuario'}`}
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="menu"
              >
                {user?.profilePhoto ? (
                  <img src={photoUrl(user.profilePhoto)} alt="" className={styles.profileImage} />
                ) : (
                  <span className={styles.avatarInitials}>{getInitials(user?.name)}</span>
                )}
              </button>

              {isProfileDropdownOpen && (
                <div className={styles.dropdown} role="menu">
                  <div className={styles.dropdownHeader}>
                    <strong>{user?.name}</strong>
                    <p>{user?.email}</p>
                  </div>
                  <hr />
                  <button className={styles.dropdownItem} onClick={openPicker} disabled={uploading} role="menuitem">
                    <IconCameraW />
                    {uploading ? 'Subiendo...' : 'Cambiar foto de perfil'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={handleFileChange}
                  />
                  <button className={styles.dropdownItem} onClick={handleLogout} role="menuitem">
                    <IconLogOut />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
