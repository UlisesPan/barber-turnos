import styles from './MyAppointments.module.css';
import useAppointments from './useAppointmentsHooks';
import { useAuth } from '../../context/Auth/AuthContext';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import { Link } from 'react-router-dom';
import { IconPadlock, IconCalendar, IconLogOut, IconScissor, IconUser, IconCameraW, IconPriceTag } from '../../components/Icons/Icons.jsx';
import useProfilePhotoUpload from '../../hooks/useProfilePhotoUpload';
import { photoUrl } from '../../api/axiosInstance';
import { formatLongDate as formatDate, getInitials } from '../../utils/format';

const MyAppointments = () => {
  const { user, logout } = useAuth();
  const { fileInputRef, openPicker, handleFileChange, uploading, uploadError } = useProfilePhotoUpload();

  const {
    loading, error, cancellingId,
    pendingCancelId, requestCancel, dismissCancel, confirmCancel,
    activeAppointments, pastAppointments, navigate,
  } = useAppointments();

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <button
          type="button"
          className={styles.avatarWrapper}
          onClick={openPicker}
          disabled={uploading}
          aria-label="Cambiar foto de perfil"
          title="Cambiar foto de perfil"
          style={{ border: 'none', padding: 0, font: 'inherit' }}
        >
          {user?.profilePhoto ? (
            <img src={photoUrl(user.profilePhoto)} alt="" className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarInitials}>{getInitials(user?.name)}</span>
          )}
          <div className={styles.avatarOverlay}><IconCameraW /></div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
        {uploadError && <p className={styles.errorMsg} role="alert">{uploadError}</p>}

        <p className={styles.userName}>{user?.name}</p>
        <span className={styles.badge}>{user?.role === 'admin' ? 'ADMIN' : 'CLIENTE'}</span>

        <nav className={styles.sideNav}>
          {user?.role === 'admin' ? (
            <>
              <button
                className={styles.navItem}
                onClick={() => navigate('/reserve', { state: { adminMode: 'book' } })}
              >
                <IconScissor/> Agendar turno
              </button>
              <button
                className={styles.navItem}
                onClick={() => navigate('/reserve', { state: { adminMode: 'block' } })}
              >
                <IconPadlock/> Bloquear agenda
              </button>
              <button
                className={styles.navItem}
                onClick={() => navigate('/servicios/gestionar')}
              >
                <IconPriceTag/> Gestionar precios
              </button>
            </>
          ) : (
            <Link to="/reserve" className={styles.navItem}>
               <IconScissor/> Reservar turno
            </Link>
          )}
          <button
            className={`${styles.navItem} ${styles.logoutBtn}`}
            onClick={() => { logout(); navigate('/'); }}
          >
            <IconLogOut/> Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className={styles.main}>
        {loading ? (
          <div className={styles.spinner}>
            <div className={styles.spinnerCircle} />
            <p>Cargando tus turnos...</p>
          </div>
        ) : error ? (
          <p className={styles.errorMsg} role="alert">{error}</p>
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
                      <div className={styles.cardIcon}>
                        <IconCalendar/>
                      </div>
                      <div className={styles.cardInfo}>
                        <p className={styles.cardDate}>
                          {formatDate(a.date)} — {a.time} hs
                        </p>
                        <p className={styles.cardService}>{a.category?.name}</p>
                        {user?.role === 'admin' && a.user?.name && (
                          <p className={styles.cardClient}><IconUser/> {a.user.name}</p>
                        )}
                      </div>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => requestCancel(a.id)}
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
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN */}
      <ConfirmModal
        isOpen={!!pendingCancelId}
        title="¿Cancelar turno?"
        message="Esta acción no se puede deshacer. El turno quedará marcado como cancelado."
        confirmText="Sí, cancelar"
        cancelText="Volver"
        danger
        onConfirm={confirmCancel}
        onCancel={dismissCancel}
      />
    </div>
  );
};

export default MyAppointments;
