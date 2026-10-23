import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import { IconMail, IconLock, IconEye } from '../../components/Icons/Icons';
import useLoginForm from './useLoginForm.js';

const Login = () => {
  const { formData, showPassword, togglePassword, loading, error, 
          handleChange, handleSubmit} = useLoginForm();
 
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.brandPanel}>
          <div className={styles.brandTop}>
            <h2>CHACO BARBER</h2>
            <p className={styles.brandTagline}>PRECISIÓN PERSONALIZADA</p>
          </div>
          <p className={styles.brandText}>
            Bienvenido a la barbería donde vas a encontrar tu estilo.
          </p>
        </div>

        <div className={styles.formPanel}>
          <h1>Acceso de Miembros</h1>
          <p className={styles.description}>
            Ingresá tus datos para continuar.
          </p>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconMail /></span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Contraseña</label>
              </div>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconLock /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={togglePassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <IconEye open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Ingresar →'}
            </button>
          </form>

          <div className={styles.registerLink}>
            ¿No tenés cuenta? <Link to="/register">Registrarme</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
