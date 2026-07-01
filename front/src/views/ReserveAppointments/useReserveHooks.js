import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { getCategories } from "../../services/categoryService";
import { getUsers } from "../../services/userService";
import {
  getAvailability,
  scheduleAppointment,
  getBlockedSlots,
  blockSlot,
  unblockSlot,
} from "../../services/appointmentService";
import AuthContext from '../../context/Auth/AuthContext';
import { ALL_SLOTS } from './slots';

const generateCalendarDays = (year, month) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizo para comparar solo fechas, sin hora

  const firstDow = new Date(year, month, 1).getDay(); // Día de semana del 1ro (0=Dom, 1=Lun...)
  // Calculo cuántas celdas vacías poner antes del día 1 para que el lunes sea la primera columna
  const padding = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Días totales del mes
  const days = [];

  // Celdas vacías de relleno (antes del día 1)
  for (let i = 0; i < padding; i++) days.push({ day: null, dateStr: null, disabled: true });

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      day: d,
      dateStr,
      // Deshabilito si es pasado, o si es viernes (5), sábado (6), o domingo (0)
      disabled: date < today || dow === 0 || dow === 5 || dow === 6,
    });
  }
  return days;
};

export const useReserveAppointments = () => {
  const { user, isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // 'book' = agendar turno · 'block' = bloquear agenda. Lo manda MyAppointments en location.state.
  const adminMode = location.state?.adminMode ?? 'book';
  const isAdmin = user?.role === 'admin';
  const isAdminBookMode = isAdmin && adminMode === 'book'; // admin agendando para un cliente
  const isAdminBlockMode = isAdmin && adminMode === 'block';

  const [services, setServices] = useState([]);          // Lista de servicios del backend
  const [selectedService, setSelectedService] = useState(null);
  // En modo bloqueo arranco en el paso 2 (fecha/hora): bloquear no requiere elegir servicio
  const [currentStep, setCurrentStep] = useState(adminMode === 'block' ? 2 : 1); // Paso actual: 1, 2 o 3
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Mes visible en el calendario
  const [selectedDate, setSelectedDate] = useState(null);       // "2026-06-15"
  const [selectedTime, setSelectedTime] = useState(null);       // "10:30"
  const [takenSlots, setTakenSlots] = useState([]);     // Horarios ya ocupados para la fecha elegida
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);  // Evita doble click en confirmar
  const [success, setSuccess] = useState(null);         // Datos del turno confirmado (null = no confirmado aún)
  const [error, setError] = useState('');
  const [blockedSlots, setBlockedSlots] = useState([]); // Array de objetos { id, time }
  const [isDayBlocked, setIsDayBlocked] = useState(false);
  const [blockingSlot, setBlockingSlot] = useState(null); // slot que se está procesando
  // Solo se usan cuando el admin agenda para otro: lista de clientes y el elegido
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const now = new Date();
  const todayStr =
    `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  const pastSlotsToday = selectedDate === todayStr
    ? ALL_SLOTS.filter((slot) => {
        const [h, m] = slot.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(h, m, 0, 0);
        return slotTime <= now;
      })
    : [];

  // Set para RESERVAR: un slot no se puede reservar si está ocupado, es pasado, está bloqueado,
  // o el día entero está bloqueado. Lo usan el usuario normal y el admin en modo "agendar".
  const disabledSlots = [...new Set([...takenSlots, ...pastSlotsToday,
    ...(isDayBlocked ? ALL_SLOTS : blockedSlots.map(b => b.time)),])];
  // Set SOLO de horarios pasados. Lo usa el modo bloqueo para no dejar (des)bloquear el pasado,
  // sin confundir "bloqueado" con "pasado" (si no, el admin no podría desbloquear un slot).
  const pastSlots = pastSlotsToday;

  // Al montar, cargo los servicios desde /categories
  useEffect(() => {
    getCategories()
      .then((res) => setServices(res.data))
      .catch(() => setError('No se pudieron cargar los servicios.'))
      .finally(() => setLoading(false));
  }, []);

  // Si el admin entra a "Agendar turno", traigo la lista de usuarios para elegir a quién agendarle
  useEffect(() => {
    if (!isAdminBookMode) return;
    getUsers()
      .then((res) => setClients(res.data))
      .catch(() => setError('No se pudieron cargar los clientes.'));
  }, [isAdminBookMode]);

  // Cuando el usuario elige un servicio, guardo la selección y avanzo automáticamente al paso 2
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setCurrentStep(2);
  };

  // Normaliza la respuesta de blockedSlots a objetos { id, time } sin importar si el
  // endpoint devuelve strings o ya devuelve objetos completos.
  const normalizeBlockedSlots = (raw) =>
    (raw ?? []).map(s => (typeof s === 'string' ? { id: null, time: s } : s));

  // Cuando elige una fecha, pido al backend qué horarios ya están tomados para ese día
  const handleDateSelect = async (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedTime(null);
    try {
      const res = await getAvailability(dateStr);
      setTakenSlots(res.data.takenSlots);
      setBlockedSlots(normalizeBlockedSlots(res.data.blockedSlots));
      setIsDayBlocked(res.data.isDayBlocked);
    } catch {
      setTakenSlots([]);
      setBlockedSlots([]);
      setIsDayBlocked(false);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // El botón "Continuar" del panel derecho va al paso 3 (o manda al login si no está autenticado)
  const handleGoToConfirm = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setCurrentStep(3);
  };

  const handleToggleBlockSlot = async (time) => {
    if (!selectedDate) return;
    setBlockingSlot(time);
    try {
      const isBlocked = blockedSlots.some(b => b.time === time);
      if (isBlocked) {
        let entry = blockedSlots.find(b => b.time === time);
        // Si el id es null (vino como string de getAvailability), lo buscamos con el endpoint admin
        if (!entry?.id) {
          const fetchRes = await getBlockedSlots(selectedDate, token);
          entry = fetchRes.data.find(b => b.time === time);
        }
        if (entry) await unblockSlot(entry.id, token);
        setBlockedSlots(prev => prev.filter(b => b.time !== time));
      } else {
        const res = await blockSlot(selectedDate, time, token);
        // Usamos el objeto devuelto por la API si tiene la forma esperada; sino guardamos solo el time
        const newEntry = res?.data?.time ? res.data : { id: null, time };
        setBlockedSlots(prev => [...prev, newEntry]);
        setSelectedTime(prev => prev === time ? null : prev);
      }
    } catch {
      setError('No se pudo actualizar el bloqueo.');
    } finally {
      setBlockingSlot(null);
    }
  };

  const handleToggleBlockDay = async () => {
    if (!selectedDate) return;
    try {
      if (isDayBlocked) {
        const res = await getBlockedSlots(selectedDate, token);
        const entry = res.data.find(b => b.time === null);
        if (entry) await unblockSlot(entry.id, token);
        setIsDayBlocked(false);
      } else {
        await blockSlot(selectedDate, null, token);
        setIsDayBlocked(true);
        setSelectedTime(null);
      }
    } catch {
      setError('No se pudo actualizar el bloqueo del día.');
    }
  };

  // Llamada real a la API para crear el turno
  const handleConfirm = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await scheduleAppointment({
        userId: isAdminBookMode ? selectedClient.id : user.id,
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
      });
      // Si sale bien, guardo los datos del turno → esto activa la pantalla de éxito
      setSuccess({ service: selectedService, date: selectedDate, time: selectedTime,
        client: isAdminBookMode ? selectedClient : null, data: res.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el turno.');
      setCurrentStep(2); // Vuelvo al paso 2 para que pueda elegir otro horario
    } finally {
      setSubmitting(false);
    }
  };

  // Navegación entre meses. No permite ir a meses anteriores al actual.
  const prevMonth = () => {
    const today = new Date();
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const calendarDays = generateCalendarDays(year, month);
  const today = new Date();
  // Sirve para deshabilitar el botón "mes anterior" cuando ya estamos en el mes actual
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return {
    user,
    adminMode,
    isAdminBookMode,
    isAdminBlockMode,
    clients,
    selectedClient,
    setSelectedClient,
    backstep: (step) => step != null ? setCurrentStep(step) : setCurrentStep((prev) => Math.max(1, prev - 1)),
    goToStep: (n) => setCurrentStep(n),
    services,
    selectedService,
    currentStep,
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
  };
};
