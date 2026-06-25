import { useState, useContext, useRef } from 'react';
import { uploadPhoto } from '../../services/userService';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import AuthContext from '../../context/Auth/AuthContext.jsx';
import ThemeToggle from '../ButtonThemeToggle/ThemeToggle.jsx'
import logoBarber from '/Logo-barber.png'
import { IconLogOut, IconCameraW } from '../Icons/Icons.jsx';
const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Turnos', href: '/turnos' },
  { label: 'Contacto', href: '/contact' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, login, token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

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

  const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const res = await uploadPhoto(user.id, file);
    login({ ...user, profilePhoto: res.profilePhoto }, token);
  } catch {
    // silencioso — si falla, no rompe el navbar
  }
};
  return (
    <header className={styles.navWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <a href="/" >
          <img src={logoBarber} alt=""className={styles.logo} />
          </a>
        </div>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
    {NAV_LINKS.map((link) => (
  <li key={link.href}>
    <Link
      to={link.href}
      className={location.pathname === link.href ? styles.activeLink : ''}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {link.label}
    </Link>
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
            <div className={styles.profileContainer}>
              <button
                className={styles.avatarButton}
                onClick={toggleProfileDropdown}
                title={user?.name}
              >
                {user?.profilePhoto ? (
                   <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePhoto}`}
                    alt={user.name}
                    className={styles.profileImage}
                  />
                ) : (
                  <span className={styles.avatarInitials}>{getInitials()}</span>
                )}
              </button>

              {isProfileDropdownOpen && (
               <div className={styles.dropdown}>
  <div className={styles.dropdownHeader}>
    <strong>{user?.name}</strong>
    <p>{user?.email}</p>
  </div>
  <hr />
  <button
    className={styles.dropdownItem}
    onClick={() => fileInputRef.current?.click()}
  >
    <IconCameraW />
   Cambiar foto de perfil
  </button>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/jpeg,image/png,image/webp"
    style={{ display: 'none' }}
    onChange={handlePhotoUpload}
  />
  <button className={styles.dropdownItem} onClick={handleLogout}>
  <IconLogOut />
     Cerrar Sesión
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
