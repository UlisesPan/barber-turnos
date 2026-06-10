import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mostrar la animación por 4.5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className={styles.splashContainer}>
      <div className={styles.content}>
        {/* SVG Tijeras */}
        <svg
  className={styles.scissors }
  viewBox="0 0 200 220"
  xmlns="http://www.w3.org/2000/svg"
>
  {/* Hoja izquierda: mango arriba-izquierda, hoja cruza hacia abajo-derecha */}
  <g className={styles.scissorLeft} style={{ transformOrigin: '100px 110px' }}>
    {/* Mango (aro) */}
    <circle cx="72" cy="60" r="18" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    {/* Brazo del mango al pivote */}
    <line x1="72" y1="78" x2="100" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Hoja: del pivote hacia abajo-derecha */}
    <line x1="100" y1="110" x2="145" y2="185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </g>

  {/* Hoja derecha: mango arriba-derecha, hoja cruza hacia abajo-izquierda */}
  <g className={styles.scissorRight} style={{ transformOrigin: '100px 110px' }}>
    {/* Mango (aro) */}
    <circle cx="128" cy="60" r="18" fill="none" stroke="currentColor" strokeWidth="2.5"/>
    {/* Brazo del mango al pivote */}
    <line x1="128" y1="78" x2="100" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Hoja: del pivote hacia abajo-izquierda */}
    <line x1="100" y1="110" x2="55" y2="185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </g>

  {/* Tornillo central */}
  <circle cx="100" cy="110" r="4" fill="currentColor"/>
</svg>

        <h1 className={styles.title}>CHACO BARBER</h1>
        <p className={styles.subtitle}>Elegancia y precisión</p>
      </div>
    </div>
  );
};

export default SplashScreen;
