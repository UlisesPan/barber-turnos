import { Link } from "react-router-dom";
import styles from "./Servicios.module.css";
import useServicios from "./useServicios";
import { IconScissor } from "../../components/Icons/Icons";
import { formatPrice } from "../../utils/format";

const Servicios = () => {
  const { services, loading, error } = useServicios();

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Nuestros Servicios</h1>

      {loading && <p className={styles.description}>Cargando servicios...</p>}
      {error && <p className={styles.description}>{error}</p>}

      <div className={styles.grid}>
        {services.map((service) => (
          <article key={service.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              {service.image ? (
                <img src={service.image} alt={service.name} className={styles.image} loading="lazy" />
              ) : (
                <div className={styles.image} aria-hidden="true"
                  style={{ display: 'grid', placeItems: 'center', fontSize: '3rem', color: 'var(--accent-color)' }}>
                  <IconScissor />
                </div>
              )}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <h2 className={styles.serviceName}>{service.name}</h2>
                <span className={styles.price}>{formatPrice(service.price)}</span>
              </div>
              <div className={styles.duration}>
                <span>{service.duration} min</span>
              </div>
              <Link to="/reserve" className={styles.description}>Reservar →</Link>
            </div>
          </article>
        ))}
      </div>

      {/* Banner final */}
      <div className={styles.banner}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <h2 className={styles.bannerTitle}>Excelencia en cada detalle.</h2>
          <p className={styles.bannerSubtitle}>Artesanía que define tu identidad.</p>
        </div>
      </div>
    </section>
  );
};

export default Servicios;
