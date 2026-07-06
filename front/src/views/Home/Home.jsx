import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/Auth/AuthContext.jsx';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

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
              <button
                className={styles.primaryBtn}
                onClick={() => navigate('/register')}
              >
                Explorar servicios
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() => navigate('/login')}
              >
                Ya soy miembro
              </button>
            </div>
          ) : (
            <div className={styles.welcomeMessage}>
              <h2>¡Bienvenido, {user?.name}!</h2>
              <p>Reserva tu próximo turno y disfruta de nuestros servicios premium</p>
               <Link to="/reserve">
              <button className={styles.primaryBtn}>Agendar turno</button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.stats}>
       <div className={styles.statsImage}>
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDinZaBOIqhxgcvPJd4TTa2g6PHG4LZ7NB1LTnjrZd9zC0Z4aDSVNgIoTpiiG2EndFWf92woWtHvCsF1IRD-urmH-aaQsWm7qAZALLvjFCMN92k-D1nH1WuAv1qtAqFbENAXTEGiO4vzkZto_4b_9dQuPAQJieBWqSgU0lTPLeK8uv2mydZam_J5vFyhDQCYEh0UNCR0mM-cZc_-UbubNCwg07TIO1ELmhOZAGtW-QnptcwjixkpY7clpaJ1xhT6PRBN96C5DGjC0E" alt="IMG" loading="lazy"/>
       </div>
 <div className={styles.statsContent}>
    <h2 className={styles.statsTitle}>Trabajos Excelentes<br />Desde 2020</h2>
    <p className={styles.statsText}>
      En nuestra barberia somos especialistas en lo que hacemos.
      Sabemos que un buen corte no es solo pasar la máquina; es entender
      qué te queda bien y ayudarte a proyectar la mejor versión de ti mismo.
    </p>
    <div className={styles.statDates}>
      <div className={styles.statItem}>
        <h3>5+</h3>
        <p>años de experiencia</p>
      </div>
      <div className={styles.statItem}>
        <h3>100%</h3>
        <p>Precisión garantizada</p>
      </div>
    </div>
  </div>


</section>

      <section id="services" className={styles.services}>
        <p className={styles.sectionEyebrow}>Nuestros servicios</p>
        <h2>Ofertas a medida</h2>
        <div className={styles.servicesList}>
          <div className={styles.serviceRow}>
            <div className={styles.serviceInfo}>
              <h3>Corte Premium</h3>
              <p>Diseño personalizado según tu estilo y rostro</p>
            </div>
            <span className={styles.servicePrice}>$15.000</span>
          </div>
          <div className={styles.serviceRow}>
            <div className={styles.serviceInfo}>
              <h3>Barba & Afeitado</h3>
              <p>Afeitado tradicional con navaja y toalla caliente</p>
            </div>
            <span className={styles.servicePrice}>$10.000</span>
          </div>
          <div className={styles.serviceRow}>
            <div className={styles.serviceInfo}>
              <h3>Combo Completo</h3>
              <p>Corte + barba + tratamiento capilar premium</p>
            </div>
            <span className={styles.servicePrice}>$22.000</span>
          </div>
        </div>
        <Link to="/servicios">
        <button className={styles.moreService} >Más Servicios</button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
