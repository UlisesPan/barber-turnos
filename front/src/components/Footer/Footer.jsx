import { Link } from 'react-router-dom';
import { InstagramIcon, WhatsappIcon } from '../Icons/Icons';
import { BUSINESS, SOCIAL_LINKS, SCHEDULE } from '../../config/business';
import styles from './Footer.module.css';

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
          <p className={styles.brandName}>{BUSINESS.name}</p>
          <p className={styles.tagline}>{BUSINESS.tagline}</p>
          <div className={styles.socials}>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsappIcon />
            </a>
          </div>
        </div>

        {/* Col 2 — Navegación */}
        <nav className={styles.col} aria-label="Pie de página">
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
            <li>{BUSINESS.address}</li>
            <li>
              <a href={`tel:${BUSINESS.phone.replace(/[\s-]/g, '')}`} className={styles.link}>{BUSINESS.phone}</a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className={styles.link}>{BUSINESS.email}</a>
            </li>
          </ul>

          <p className={styles.colTitleSub}>Horarios</p>
          <ul className={styles.infoList}>
            {SCHEDULE.map((item) => (
              <li key={item.day}>{item.day}: {item.hours}</li>
            ))}
          </ul>
        </div>

      </div>

      <div className={styles.bottomBar}>
        <span>© {year} {BUSINESS.name} · Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer;
