
import styles from './ReserveAppointments.module.css';
import { useReserveAppointments } from './useReserveHooks';
import { useNavigate } from 'react-router-dom';
import { IconScissor, IconPadlock, IconUnlock, IconCheck } from '../../components/Icons/Icons';
import { MORNING_SLOTS, AFTERNOON_SLOTS } from './slots';

// Encabezados del calendario, lunes primero (estándar Argentina)
const DAY_LABELS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];
const STEPS = [
  { num: 1, label: 'SERVICIO' },
  { num: 2, label: 'FECHA & HORA' },
  { num: 3, label: 'CONFIRMAR' },
];

// Convierte "2026-06-15" a "lunes 15 de junio" para mostrar al usuario
const formatDisplayDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  // Usamos new Date(y, m-1, d) en lugar de new Date(dateStr) para evitar el bug de timezone
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
};

const SlotGroup = ({
  label, slots, isAdminBlockMode,
  takenSlots, blockedSlots, pastSlots, selectedTime, blockingSlot,
  disabledSlots, isDayBlocked, onBlockToggle, onTimeSelect,
}) => (
  <div className={styles.slotGroup}>
    <p className={styles.slotGroupLabel}>{label}</p>
    <div className={styles.slotGrid}>
      {slots.map((time) => {
        const isTaken    = takenSlots.includes(time);
        const isBlocked  = blockedSlots.some(b => b.time === time) || isDayBlocked;
        const isPast     = pastSlots.includes(time);
        const isSelected = selectedTime === time;
        if (isAdminBlockMode) {
          return (
            <button
              key={time}
              className={[
                styles.slotBtn,
                isTaken    ? styles.slotTaken    : '',
                isBlocked  ? styles.slotBlocked  : '',
                isSelected ? styles.slotSelected : '',
              ].join(' ')}
              onClick={() => !isTaken && !isPast && onBlockToggle(time)}
              disabled={isTaken || isPast || blockingSlot === time}
              title={isTaken ? 'Turno reservado' : isBlocked ? 'Bloqueado — click para desbloquear' : 'Click para bloquear'}
            >
              {blockingSlot === time ? '...' : time}
              {isBlocked && !isTaken && <IconPadlock className={styles.slotLockIcon} />}
            </button>
          );
        }
        return (
          <button
            key={time}
            className={[
              styles.slotBtn,
              isTaken    ? styles.slotTaken    : '',
              isBlocked  ? styles.slotBlocked  : '',
              isSelected ? styles.slotSelected : '',
            ].join(' ')}
            onClick={() => onTimeSelect(time)}
            disabled={disabledSlots.includes(time)}
            title={isTaken ? 'Turno ocupado' : isBlocked ? 'No disponible' : ''}
          >
            {time}{isBlocked && !isTaken && <IconPadlock className={styles.slotLockIcon} />}
          </button>
        );
      })}
    </div>
  </div>
);

const ReserveAppointments = () => {
  const navigate = useNavigate();
  const {
    services,
    selectedService,
    currentStep,
    backstep,
    currentMonth,
    selectedDate,
    selectedTime,
    disabledSlots,
    pastSlots,
    loading,
    submitting,
    success,
    error,
    handleServiceSelect,
    handleDateSelect,
    handleTimeSelect,
    handleGoToConfirm,
    handleConfirm,
    prevMonth,
    nextMonth,
    calendarDays,
    isCurrentMonth,
    takenSlots,
    blockedSlots,
    isDayBlocked,
    blockingSlot,
    handleToggleBlockSlot,
    handleToggleBlockDay,
    isAdminBookMode,
    isAdminBlockMode,
    clients,
    selectedClient,
    setSelectedClient,
  } = useReserveAppointments();

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successScreen}>
          <div className={styles.successIcon}><IconCheck /></div>
          <h2 className={styles.successTitle}>¡Turno reservado!</h2>
          <p className={styles.successSub}>Te esperamos en la barbería.</p>
          <div className={styles.successDetails}>
            {success.client && (
              <div className={styles.successRow}><span>Cliente</span><strong>{success.client.name}</strong></div>
            )}
            <div className={styles.successRow}><span>Servicio</span><strong>{success.service.name}</strong></div>
            <div className={styles.successRow}><span>Fecha</span><strong>{formatDisplayDate(success.date)}</strong></div>
            <div className={styles.successRow}><span>Hora</span><strong>{success.time} hs</strong></div>
            <div className={styles.successRow}><span>Total</span><strong>${success.service.price}</strong></div>
          </div>
          <button className={styles.successBtn} onClick={() => navigate('/turnos')}>
            Ver mis turnos →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {isAdminBlockMode ? 'GESTIÓN DE AGENDA' : 'RESERVÁ TU TURNO'}
        </h1>
        <p className={styles.pageSub}>
          {isAdminBlockMode
            ? 'Bloqueá días y horarios específicos.'
            : 'Elegí tu servicio, fecha y horario.'}
        </p>
      </div>

      {!isAdminBlockMode && (
        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <div key={step.num} className={styles.stepWrapper}>
              <div
                className={[
                  styles.stepItem,
                  currentStep >= step.num ? styles.stepActive : '',
                  currentStep > step.num ? styles.stepDone : '',
                ].join(' ')}
                onClick={() => { if (step.num < currentStep) backstep(step.num); }}
              >
                {/* Si el paso ya se completó muestra ✓, si no muestra el número */}
                <span className={styles.stepNum}>{currentStep > step.num ? <IconCheck /> : step.num}</span>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
              {/* Línea conectora entre pasos (no va después del último) */}
              {i < STEPS.length - 1 && (
                <div className={[styles.stepLine, currentStep > step.num ? styles.stepLineDone : ''].join(' ')} />
              )}
            </div>
          ))}
        </div>
      )}

      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.layout}>
        {/* PANEL IZQUIERDO: contenido del paso actual */}
        <div className={styles.leftPanel}>

          {/* PASO 1: elegir servicio */}
          {currentStep === 1 && (
            <section>
              {/* El admin que agenda para un cliente debe elegirlo antes de avanzar */}
              {isAdminBookMode && (
                <div className={styles.clientSelect}>
                  <label className={styles.clientLabel}>Cliente</label>
                  <select
                    className={styles.clientInput}
                    value={selectedClient?.id ?? ''}
                    onChange={(e) => {
                      const client = clients.find((c) => c.id === Number(e.target.value));
                      setSelectedClient(client ?? null);
                    }}
                  >
                    <option value="">Seleccioná un cliente</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <h2 className={styles.sectionTitle}>Seleccioná tu servicio</h2>
              {loading ? (
                <div className={styles.spinner}><div className={styles.spinnerCircle} /></div>
              ) : (
                <div className={styles.servicesGrid}>
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={[styles.serviceCard, selectedService?.id === service.id ? styles.serviceSelected : ''].join(' ')}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className={styles.serviceImageWrapper}>
                        {service.image
                          ? <img src={service.image} alt={service.name} className={styles.serviceImage} />
                          : <div className={styles.servicePlaceholder}><IconScissor /></div>}
                      </div>
                      <div className={styles.serviceInfo}>
                        <p className={styles.serviceName}>{service.name}</p>
                        <p className={styles.serviceDuration}>{service.duration} min</p>
                      </div>
                      <span className={styles.servicePrice}>${service.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* PASO 2: elegir fecha y hora */}
          {currentStep === 2 && (
            <section>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  {isAdminBlockMode ? 'Seleccioná fecha y horario' : 'Seleccioná fecha y hora'}
                </h2>
                <button
                  className={styles.backBtn}
                  onClick={isAdminBlockMode ? () => navigate('/turnos') : () => backstep()}
                >
                  ← Volver
                </button>
                {isAdminBlockMode && selectedDate && (
                  <button
                    className={isDayBlocked ? styles.unblockDayBtn : styles.blockDayBtn}
                    onClick={handleToggleBlockDay}
                  >
                    {isDayBlocked ? <><IconUnlock /> Desbloquear día</> : <><IconPadlock /> Bloquear día completo</>}
                  </button>
                )}
              </div>

              <div className={styles.dateTimeLayout}>
                {/* CALENDARIO */}
                <div className={styles.calendar}>
                  <div className={styles.calendarHeader}>
                    <button className={styles.monthNav} onClick={prevMonth} disabled={isCurrentMonth}>‹</button>
                    <span className={styles.monthLabel}>
                      {currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </span>
                    <button className={styles.monthNav} onClick={nextMonth}>›</button>
                  </div>
                  <div className={styles.calendarGrid}>
                    {DAY_LABELS.map((d) => <span key={d} className={styles.dayLabel}>{d}</span>)}
                    {calendarDays.map((cell, i) => (
                      <button
                        key={i}
                        className={[
                          styles.dayCell,
                          !cell.day ? styles.dayCellEmpty : '',
                          cell.disabled ? styles.dayCellDisabled : '',
                          selectedDate === cell.dateStr ? styles.dayCellSelected : '',
                        ].join(' ')}
                        onClick={() => cell.day && !cell.disabled && handleDateSelect(cell.dateStr)}
                        disabled={!cell.day || cell.disabled}
                      >
                        {cell.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HORARIOS: solo aparecen cuando hay una fecha seleccionada */}
                {selectedDate && (
                  <div className={styles.timeSlots}>
                    <SlotGroup
                      label="MAÑANA"
                      slots={MORNING_SLOTS}
                      isAdminBlockMode={isAdminBlockMode}
                      takenSlots={takenSlots}
                      blockedSlots={blockedSlots}
                      pastSlots={pastSlots}
                      selectedTime={selectedTime}
                      blockingSlot={blockingSlot}
                      disabledSlots={disabledSlots}
                      isDayBlocked={isDayBlocked}
                      onBlockToggle={handleToggleBlockSlot}
                      onTimeSelect={handleTimeSelect}
                    />
                    <SlotGroup
                      label="TARDE"
                      slots={AFTERNOON_SLOTS}
                      isAdminBlockMode={isAdminBlockMode}
                      takenSlots={takenSlots}
                      blockedSlots={blockedSlots}
                      pastSlots={pastSlots}
                      selectedTime={selectedTime}
                      blockingSlot={blockingSlot}
                      disabledSlots={disabledSlots}
                      isDayBlocked={isDayBlocked}
                      onBlockToggle={handleToggleBlockSlot}
                      onTimeSelect={handleTimeSelect}
                    />
                  </div>
                )}
              </div>
            </section>
          )}

          {/* PASO 3: resumen y confirmación final */}
          {currentStep === 3 && (
            <section>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Confirmá tu turno</h2>
                <button className={styles.backBtn} onClick={() => backstep()}>← Volver</button>
              </div>
              <div className={styles.confirmCard}>
                <div className={styles.confirmRow}><span>Servicio</span><strong>{selectedService?.name}</strong></div>
                <div className={styles.confirmRow}><span>Fecha</span><strong>{selectedDate && formatDisplayDate(selectedDate)}</strong></div>
                <div className={styles.confirmRow}><span>Hora</span><strong>{selectedTime} hs</strong></div>
                <div className={[styles.confirmRow, styles.confirmTotal].join(' ')}>
                  <span>Total</span><strong>${selectedService?.price}</strong>
                </div>
                {/* disabled mientras espera la respuesta del servidor */}
                <button className={styles.confirmBtn} onClick={handleConfirm} disabled={submitting}>
                  {submitting ? 'Confirmando...' : 'Confirmar turno'}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* PANEL DERECHO: resumen siempre visible — se actualiza en tiempo real */}
        {!isAdminBlockMode && (
          <aside className={styles.rightPanel}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>RESUMEN</h3>
              <div className={styles.summaryRows}>
                {isAdminBookMode && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Cliente</span>
                    <span className={styles.summaryValue}>{selectedClient?.name || '—'}</span>
                  </div>
                )}
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Servicio</span>
                  {/* Muestra "—" hasta que el usuario elige */}
                  <span className={styles.summaryValue}>{selectedService?.name || '—'}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Precio</span>
                  <span className={styles.summaryValue}>{selectedService ? `$${selectedService.price}` : '—'}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Fecha</span>
                  <span className={styles.summaryValue}>{selectedDate ? formatDisplayDate(selectedDate) : '—'}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Hora</span>
                  <span className={styles.summaryValue}>{selectedTime ? `${selectedTime} hs` : '—'}</span>
                </div>
              </div>

              {/* El botón "Continuar" solo aparece cuando están los 3 datos completos Y no estamos en paso 3 */}
              {selectedService && selectedDate && selectedTime && currentStep < 3 &&
                (!isAdminBookMode || selectedClient) && (
                <button className={styles.proceedBtn} onClick={handleGoToConfirm}>
                  Continuar →
                </button>
              )}
              {currentStep === 3 && (
                <p className={styles.summaryHint}>Revisá los datos y confirmá.</p>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ReserveAppointments;
