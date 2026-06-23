import styles from "./Servicios.module.css";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";




const Servicios = () => {

  const[services, setServices] = useState([])

useEffect(() => {
  axiosInstance.get('/categories')
    .then((response) => setServices(response.data))
    .catch((error) => console.error('Error al cargar servicios:', error))
}, [])
  return (
    <div>
        <section className={styles.section}>
      <h2 className={styles.title}>Nuestros Servicios</h2>

      <div className={styles.grid}>
        {services.map((service) => (
          <div key={service.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={service.image}
                alt={service.name}
                className={styles.image}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <span className={styles.serviceName}>{service.name}</span>
                <span className={styles.price}>{service.price}</span>
              </div>
              <p className={styles.description}>{service.description}</p>
              <div className={styles.duration}>
                <span>{service.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner final */}
      <div className={styles.banner}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <h3 className={styles.bannerTitle}>Excelencia en cada detalle.</h3>
          <p className={styles.bannerSubtitle}>Artesanía que define tu identidad.</p>
        </div>
      </div>
    </section>
 
      
    </div>
  )
}

export default Servicios
