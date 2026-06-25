import { Link } from 'react-router-dom';
import { InstagramIcon, WhatsappIcon, FacebookIcon } from '../Icons/Icons';
import styles from './Footer.module.css';

const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/barberiachaco',
  whatsapp: 'https://wa.me/5493329665487',
  facebook: 'https://facebook.com',
};

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Reservar turno', href: '/reserve' },
  { label: 'Mis turnos', href: '/turnos' },
  { label: 'Contacto', href: '/contact' },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Col 1 — Marca */}
        <div className={styles.brand}>
          <p className={styles.brandName}>Chaco Barber</p>
          <p className={styles.tagline}>Más que un corte, una identidad.</p>
          <div className={styles.socials}>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsappIcon />
            </a>
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </div>
        </div>

        {/* Col 2 — Navegación */}
        <nav className={styles.col}>
          <p className={styles.colTitle}>Navegación</p>
          <ul className={styles.linkList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className={styles.link}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3 — Contacto + Horarios */}
        <div className={styles.col}>
          <p className={styles.colTitle}>Contacto</p>
          <ul className={styles.infoList}>
            <li>Av. San Martín, La Violeta<br />Pergamino, Buenos Aires (2751)</li>
            <li>
              <a href="tel:+5493329665487" className={styles.link}>+54 9 3329-665487</a>
            </li>
            <li>
              <a href="mailto:contacto@barberia.com" className={styles.link}>contacto@barberia.com</a>
            </li>
          </ul>

          <p className={styles.colTitleSub}>Horarios</p>
          <ul className={styles.infoList}>
            <li>Lun – Jue: 10:00 – 13:00 · 16:00 – 20:00</li>
            <li>Vie y Sáb: orden de llegada</li>
            <li>Dom: cerrado</li>
          </ul>
        </div>

      </div>

      <div className={styles.bottomBar}>
        <span>© {year} Chaco Barber · Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer;
