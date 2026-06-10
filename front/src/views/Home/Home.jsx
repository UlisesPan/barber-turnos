import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/Auth/AuthContext.jsx';
import styles from './Home.module.css';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
    <section className={styles.hero}>
  
  <div className={styles.heroContent}>
    <p className={styles.heroEyebrow}></p>
    <h1 className={styles.title}>
      Más que un corte,<br />
      <span>una identidad</span>
    </h1>
    {!isAuthenticated ? (
      <div className={styles.ctaButtons}>
        <button
          className={styles.primaryBtn}
          onClick={() => navigate('/register')}
        >
          EXPLORAR SERVICIOS
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={() => navigate('/login')}
        >
          YA SOY MIEMBRO
        </button>
      </div>
    ) : (
      <div className={styles.welcomeMessage}>
        <h2>¡Bienvenido, {user?.name}!</h2>
        <p>Reserva tu próximo turno y disfruta de nuestros servicios premium</p>
        <button className={styles.primaryBtn}>📅 AGENDAR TURNO</button>
      </div>
    )}
  </div>
</section>

      {/* Sección de Estadísticas */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <h3>5+</h3>
          <p>Años de experiencia</p>
        </div>
        
        <div className={styles.statItem}>
          <h3>100%</h3>
          <p>Precisión garantizada</p>
        </div>
      </section>

      {/* Sección de Servicios (Opcional) */}
      <section className={styles.services}>
        <h2>Nuestros Servicios</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <span>💇</span>
            <h3>Cortes Premium</h3>
            <p>Diseños personalizados según tu estilo</p>
          </div>
          <div className={styles.serviceCard}>
            <span>🧔</span>
            <h3>Barbería</h3>
            <p>Afeitados tradicionales con técnica experta</p>
          </div>
         
        </div>
      </section>
    </div>
  );
};

export default Home;
