import styles from './Contact.module.css';
import imgBarber from '../../assets/img-de-la-barber.png'
import {LocationIcon, PhoneIcon, MailIcon, InstagramIcon, WhatsappIcon, FacebookIcon,  MapPinIcon   } from '../../components/Icons/Icons'
/* ──────────────────────────────────────────────────────────────
   Datos editables: cambiá estos valores con la info real del local
   ────────────────────────────────────────────────────────────── */


// Ubicación del local (la usa el mapa y el botón "Cómo llegar")
const LOCATION = {
  address: 'Av. San Martín, La Violeta, Pergamino, Buenos Aires',
  lat: -33.73232876221021,
  lng: -60.17356454664363,
};

const CONTACT_INFO = {
  addressLines: ['Av. San Martín, La Violeta, Pergamino, Buenos Aires (2751)'],
  phone: '+54 9 3329-665487',
  email: 'contacto@barberia.com',
};

const SCHEDULE = [
  { day: 'Lunes a Jueves', hours: '10:00 — 13:00 y 16:00 — 20:00' },
  { day: 'Viernes y Sábados', hours: 'Orden de llegada' },
  { day: 'Domingos', hours: 'Cerrado' },
];

const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/barberiachaco',
  whatsapp: 'https://wa.me/5493329665487',
  facebook: 'https://facebook.com',
};

// URLs del mapa 
const mapEmbedUrl = `https://www.google.com/maps?q=${LOCATION.lat},${LOCATION.lng}&z=16&output=embed`;




const Contact = () => {
  return (
    <div className={styles.contactContainer}>
      {/* ===== Hero ===== */}
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Conectá con <span>nosotros</span>
        </h1>
        <p className={styles.subtitle}>
          Viví la experiencia de una barbería de primer nivel. Acercate, escribinos
          o pasá a conocernos: estamos para ayudarte con turnos y consultas.
        </p>
      </section>

      {/* ===== Grilla ===== */}
      <div className={styles.grid}>
        {/* Fila 1 · Información del estudio */}
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Nuestro Local</h2>

          <ul className={styles.infoList}>
            <li className={styles.infoItem}>
              <span className={styles.iconBadge}>
                <LocationIcon />
              </span>
              <div>
                <span className={styles.infoLabel}>Dirección</span>
                <p className={styles.infoValue}>
                  {CONTACT_INFO.addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < CONTACT_INFO.addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.iconBadge}>
                <PhoneIcon />
              </span>
              <div>
                <span className={styles.infoLabel}>Teléfono</span>
                <p className={styles.infoValue}>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>
                    {CONTACT_INFO.phone}
                  </a>
                </p>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.iconBadge}>
                <MailIcon />
              </span>
              <div>
                <span className={styles.infoLabel}>Email</span>
                <p className={styles.infoValue}>
                  <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
                </p>
              </div>
            </li>
          </ul>

          <div className={styles.socials}>
            <span className={styles.infoLabel}>Seguinos</span>
            <div className={styles.socialIcons}>
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
        </article>

        {/* Fila 1 · Imagen (en lugar del formulario) */}
        <div className={styles.imageCard}>
          <img className={styles.imageEl} src={imgBarber} alt="Nuestra barbería" loading="lazy" />
        </div>

        {/* Fila 2 · Horarios */}
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Horarios de Atención</h2>
          <ul className={styles.hoursList}>
            {SCHEDULE.map((item) => (
              <li key={item.day} className={styles.hoursRow}>
                <span className={styles.hoursDay}>{item.day}</span>
                <span className={styles.hoursLeader} />
                <span className={styles.hoursTime}>{item.hours}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* Fila 2 · Mapa con pin que parpadea */}
        <div className={styles.mapCard}>
          <iframe
            className={styles.mapFrame}
            src={mapEmbedUrl}
            title="Ubicación en el mapa"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className={styles.pin} aria-hidden="true">
            <span className={`${styles.pinPing} ${styles.pinPing2}`} />
            <span className={styles.pinPing} />
            <MapPinIcon />
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Contact;
