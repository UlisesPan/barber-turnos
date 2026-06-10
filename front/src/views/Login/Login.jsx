import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/Auth/AuthContext.jsx';
import styles from './Login.module.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }

      // Guardar usuario y token
      login(data.user, data.token);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>CHACO BARBER</h1>
        <p className={styles.subtitle}>Acceso de miembros</p>
        <p className={styles.description}>
          Ingrese sus credenciales para continuar.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>📧 EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              🔐 PASSWORD
              <a href="#" className={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'LOGIN →'}
          </button>
        </form>

        <div className={styles.registerLink}>
          Not a member yet? <a href="/register">Request Access</a>
        </div>
      </div>

      {/* Lado decorativo con imagen */}
      <div className={styles.decorative}>
        <div className={styles.decorativeContent}>
          <h2>✂️ CHACO BARBER</h2>
          <p className={styles.decorativeSubtitle}>PRECISION PERSONIFIED</p>
          <p>
            Welcome to the inner circle. Access your appointments, manage preferences, and
            experience bespoke grooming.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
