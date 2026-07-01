import styles from './ManageServices.module.css';
import { IconPriceTag } from '../../components/Icons/Icons';
import { useManageServices } from './useManageServicesHooks';

const ManageServices = () => {
  const {
    services,
    prices,
    loading,
    savingId,
    error,
    success,
    navigate,
    handlePriceChange,
    handleSave,
  } = useManageServices();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}><IconPriceTag /> GESTIÓN DE PRECIOS</h1>
        <button className={styles.backBtn} onClick={() => navigate('/turnos')}>← Volver</button>
      </div>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {success && <div className={styles.successMsg}>{success}</div>}

      {loading ? (
        <div className={styles.spinner}><div className={styles.spinnerCircle} /></div>
      ) : (
        <div className={styles.list}>
          {services.map((service) => {
            // El precio cambió respecto al guardado → habilita el botón
            const isDirty = Number(prices[service.id]) !== Number(service.price);
            return (
              <div key={service.id} className={styles.row}>
                <span className={styles.serviceName}>{service.name}</span>
                <div className={styles.priceEdit}>
                  <span className={styles.currency}>$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    className={styles.priceInput}
                    value={prices[service.id] ?? ''}
                    onChange={(e) => handlePriceChange(service.id, e.target.value)}
                  />
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSave(service)}
                    disabled={savingId === service.id || !isDirty}
                  >
                    {savingId === service.id ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageServices;
