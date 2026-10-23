import { Link } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';
import useServicios from '../Servicios/useServicios';
import { formatPrice } from '../../utils/format';
import imgBarber from '../../assets/img-de-la-barber.webp';
import styles from './Home.module.css';

const FEATURED_COUNT = 3;

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { services, loading } = useServicios();
  const featured = services.slice(0, FEATURED_COUNT);

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>
            Barbería artesanal para el hombre moderno
          </p>
          <h1 className={styles.title}>
            Más que un corte,<br />
            <span>una identidad</span>
          </h1>
          {!isAuthenticated ? (
            <div className={styles.ctaButtons}>
              <Link to="/reserve" className={styles.primaryBtn}>Reservar turno</Link>
              <Link to="/login" className={styles.secondaryBtn}>Ya soy cliente</Link>
            </div>
          ) : (
            <div className={styles.welcomeMessage}>
              <h2>¡Bienvenido, {user?.name}!</h2>
              <p>Reservá tu próximo turno y disfrutá de nuestros servicios.</p>
              <Link to="/reserve" className={styles.primaryBtn}>Agendar turno</Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsImage}>
          <img src={imgBarber} alt="Interior de la barbería Chaco Barber" loading="lazy" width="800" height="600" />
        </div>
        <div className={styles.statsContent}>
          <h2 className={styles.statsTitle}>Trabajos excelentes<br />desde 2020</h2>
          <p className={styles.statsText}>
            En nuestra barbería somos especialistas en lo que hacemos.
            Sabemos que un buen corte no es solo pasar la máquina: es entender
            qué te queda bien y ayudarte a proyectar la mejor versión de vos mismo.
          </p>
          <div className={styles.statDates}>
            <div className={styles.statItem}>
              <h3>5+</h3>
              <p>años de experiencia</p>
            </div>
            <div className={styles.statItem}>
              <h3>Lun–Jue</h3>
              <p>con turno online</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className={styles.services}>
        <p className={styles.sectionEyebrow}>Nuestros servicios</p>
        <h2>Ofertas a medida</h2>
        <div className={styles.servicesList}>
          {loading && <p>Cargando servicios...</p>}
          {featured.map((service) => (
            <div key={service.id} className={styles.serviceRow}>
              <div className={styles.serviceInfo}>
                <h3>{service.name}</h3>
                <p>{service.duration} min</p>
              </div>
              <span className={styles.servicePrice}>{formatPrice(service.price)}</span>
            </div>
          ))}
        </div>
        <Link to="/servicios" className={styles.moreService}>Ver todos los servicios</Link>
      </section>
    </div>
  );
};

export default Home;
