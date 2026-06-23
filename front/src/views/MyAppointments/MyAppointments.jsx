import styles from './MyAppointments.module.css';
import useAppointments from './useAppointmentsHooks';
import AuthContext from '../../context/Auth/AuthContext.jsx'
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
  const [year, month, day] = (dateStr.split('T')[0]).split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const MyAppointments = () => {
    const { user,  logout} = useContext(AuthContext);

    const { fileInputRef, loading, error, cancellingId, handleCancel, handlePhotoUpload,
       getInitials,activeAppointments, pastAppointments, navigate } = useAppointments()

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div
          className={styles.avatarWrapper}
          onClick={() => fileInputRef.current?.click()}
          title="Cambiar foto de perfil"
        >
          {user?.profilePhoto ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePhoto}`}
              alt={user.name}
              className={styles.avatarImg}
            />
          ) : (
            <span className={styles.avatarInitials}>{getInitials()}</span>
          )}
          <div className={styles.avatarOverlay}>📷</div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.hiddenInput}
          onChange={handlePhotoUpload}
        />

        <p className={styles.userName}>{user?.name}</p>
        <span className={styles.badge}>{user?.role === 'admin' ? 'ADMIN' : 'CLIENTE'}</span>

        <nav className={styles.sideNav}>
  {user?.role === 'admin' ? (
    <>
      <button
        className={styles.navItem}
        onClick={() => navigate('/reserve', { state: { adminMode: 'book' } })}
      >
        ✂️ Agendar turno
      </button>
      <button
        className={styles.navItem}
        onClick={() => navigate('/reserve', { state: { adminMode: 'block' } })}
      >
        🔒 Bloquear agenda
      </button>
    </>
  ) : (
    <Link to="/reserve" className={styles.navItem}>
      ✂️ Reservar turno
    </Link>
  )}
  <button
    className={`${styles.navItem} ${styles.logoutBtn}`}
    onClick={() => { logout(); navigate('/'); }}
  >
    🚪 Cerrar sesión
  </button>
</nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className={styles.main}>
        {loading ? (
          <div className={styles.spinner}>
            <div className={styles.spinnerCircle} />
            <p>Cargando tus turnos...</p>
          </div>
        ) : error ? (
          <p className={styles.errorMsg}>{error}</p>
        ) : (
          <>
            <section>
              <h2 className={styles.sectionTitle}>Próximos Turnos</h2>
              {activeAppointments.length === 0 ? (
                <div className={styles.empty}>
                  <p>No tenés turnos activos.</p>
                  <Link to="/reserve" className={styles.createLink}>
                    Reservá tu turno →
                  </Link>
                </div>
              ) : (
                <div className={styles.activeList}>
                  {activeAppointments.map((a) => (
                    <div key={a.id} className={styles.activeCard}>
                      <div className={styles.cardIcon}>📅</div>
                      <div className={styles.cardInfo}>
                        <p className={styles.cardDate}>
                          {formatDate(a.date)} — {a.time} hs
                        </p>
                        <p className={styles.cardService}>{a.category?.name}</p>
                        {user?.role === 'admin' && a.user?.name && (
                          <p className={styles.cardClient}>👤 {a.user.name}</p>
                        )}
                      </div>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancel(a.id)}
                        disabled={cancellingId === a.id}
                      >
                        {cancellingId === a.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {pastAppointments.length > 0 && (
              <section>
                <h2 className={styles.sectionTitle}>Historial</h2>
                <div className={styles.pastGrid}>
                  {pastAppointments.map((a) => (
                    <div
                      key={a.id}
                      className={`${styles.pastCard} ${a.status === 'cancelled' ? styles.cancelled : ''}`}
                    >
                      <p className={styles.pastDate}>{formatDate(a.date)}</p>
                      <p className={styles.pastService}>{a.category?.name}</p>
                      <span className={`${styles.statusBadge} ${a.status === 'cancelled' ? styles.badgeCancelled : styles.badgeCompleted}`}>
                      {a.status === 'cancelled' ? 'Cancelado' : 'Completado'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MyAppointments;
