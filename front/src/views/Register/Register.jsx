import { Link } from 'react-router-dom';
import styles from './Register.module.css';
import { IconUser, IconMail, IconLock, IconEye, IconCalendar, IconId } from '../../components/Icons/Icons';
import navajaImg from '../../assets/navaja-svg.webp';
import useRegisterForm from './useFormRegister';


const Register = () => {
   const { formData, errors, showPassword, togglePassword, loading, error, success,
          handleChange, handleBlur, handleSubmit} = useRegisterForm();
   const FIELD_ORDER = ['name', 'email', 'birthdate', 'nDni', 'password'];
   const firstErrorField = FIELD_ORDER.find((field) => errors[field]);

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoRow}>
            <img src={navajaImg} alt="Chaco Barber" className={styles.logoImg} />
            <div className={styles.logoText}>
              <span className={styles.logoBrand1}>Chaco</span>
              <span className={styles.logoBrand2}>Barber</span>
            </div>
          </div>
          <h2 className={styles.formTitle}>Registro</h2>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
  <div className={styles.inputWrapper}>
    <span className={styles.inputIcon}><IconUser /></span>
    <input id="name" type="text" name="name" value={formData.name}
      onChange={handleChange} onBlur={handleBlur}
      placeholder="Nombre Completo" aria-label="Nombre completo" required />
  </div>
  {firstErrorField === 'name' && (
  <span className={styles.fieldError}>{errors.name}</span>
)}
</div>

{/* EMAIL */}
<div className={styles.formGroup}>
  <div className={styles.inputWrapper}>
    <span className={styles.inputIcon}><IconMail /></span>
    <input id="email" type="email" name="email" value={formData.email}
      onChange={handleChange} onBlur={handleBlur}
      placeholder="Correo Electrónico" aria-label="Email" required />
  </div>
{firstErrorField === 'email' && (
  <span className={styles.fieldError}>{errors.email}</span>
)}
 </div>
{/* FECHA */}
<div className={styles.formGroup}>
  <div className={styles.inputWrapper}>
    <span className={styles.inputIcon}><IconCalendar /></span>
    <input id="birthdate" type="date" name="birthdate" value={formData.birthdate}
      onChange={handleChange} onBlur={handleBlur}
      aria-label="Fecha de nacimiento" required />
  </div>
  {firstErrorField === 'birthdate' && (
  <span className={styles.fieldError}>{errors.birthdate}</span>
)}
</div>

{/* DNI */}
<div className={styles.formGroup}>
  <div className={styles.inputWrapper}>
    <span className={styles.inputIcon}><IconId /></span>
    <input id="nDni" type="number" name="nDni" value={formData.nDni}
      onChange={handleChange} onBlur={handleBlur}
      placeholder="DNI" aria-label="DNI" required />
  </div>
  {firstErrorField === 'nDni' && (
  <span className={styles.fieldError}>{errors.nDni}</span>
)}
</div>

{/* CONTRASEÑA */}
<div className={styles.formGroup}>
  <div className={styles.inputWrapper}>
    <span className={styles.inputIcon}><IconLock /></span>
    <input id="password" type={showPassword ? 'text' : 'password'}
      name="password" value={formData.password}
      onChange={handleChange} onBlur={handleBlur}
      placeholder="Mínimo 6 caracteres" required />
    <button type="button" className={styles.togglePassword}
      onClick={togglePassword}
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
      <IconEye open={showPassword} />
    </button>
  </div>
  {firstErrorField === 'password' && (
  <span className={styles.fieldError}>{errors.password}</span>
)}
</div>

          <button type="submit" className={styles.registerBtn} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className={styles.loginLink}>
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
