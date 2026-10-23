import { useEffect } from 'react';
import styles from './SplashScreen.module.css';

// Debe coincidir con el fadeOut de SplashScreen.module.css (2s + 0.4s)
const SPLASH_DURATION_MS = 2400;

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={styles.splashContainer} onClick={onFinish} role="presentation">
      <div className={styles.content}>
        <svg className={styles.scissors} viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Hoja izquierda: mango arriba-izquierda, hoja cruza hacia abajo-derecha */}
          <g className={styles.scissorLeft} style={{ transformOrigin: '100px 110px' }}>
            <circle cx="72" cy="60" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="72" y1="78" x2="100" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="100" y1="110" x2="145" y2="185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Hoja derecha: mango arriba-derecha, hoja cruza hacia abajo-izquierda */}
          <g className={styles.scissorRight} style={{ transformOrigin: '100px 110px' }}>
            <circle cx="128" cy="60" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="128" y1="78" x2="100" y2="110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="100" y1="110" x2="55" y2="185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Tornillo central */}
          <circle cx="100" cy="110" r="4" fill="currentColor" />
        </svg>

        <h1 className={styles.title}>CHACO BARBER</h1>
        <p className={styles.subtitle}>Elegancia y precisión</p>
      </div>
    </div>
  );
};

export default SplashScreen;
