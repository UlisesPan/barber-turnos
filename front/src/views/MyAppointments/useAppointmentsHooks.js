import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllAppointments,
  getUserAppointments,
  cancelAppointment,
} from "../../services/appointmentService";
import { useAuth } from "../../context/Auth/AuthContext";
import { apiErrorMessage } from "../../api/axiosInstance";
import { parseLocalDate } from "../../utils/format";

const isPast = (a, now) => {
  const date = parseLocalDate(a.date);
  const [h, min] = a.time.split(':').map(Number);
  date.setHours(h, min, 0, 0);
  return date <= now;
};

// La ruta está protegida (ProtectedRoute): acá siempre hay usuario
const useAppointments = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [pendingCancelId, setPendingCancelId] = useState(null);

  useEffect(() => {
    const request = isAdmin ? getAllAppointments() : getUserAppointments(user.id);
    request
      .then((res) => setAppointments(res.data))
      .catch(() => setError('No se pudieron cargar los turnos.'))
      .finally(() => setLoading(false));
  }, [isAdmin, user.id]);

  const requestCancel = (id) => setPendingCancelId(id);
  const dismissCancel = () => setPendingCancelId(null);

  const confirmCancel = async () => {
    const id = pendingCancelId;
    setPendingCancelId(null);
    setCancellingId(id);
    try {
      await cancelAppointment(id);
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
    } catch (err) {
      setError(apiErrorMessage(err, 'No se pudo cancelar el turno.'));
    } finally {
      setCancellingId(null);
    }
  };

  const now = new Date();
  // Próximos: el más cercano primero. Historial: el más reciente primero.
  const activeAppointments = appointments
    .filter((a) => a.status === 'active' && !isPast(a, now))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const pastAppointments = appointments
    .filter((a) => a.status !== 'active' || isPast(a, now))
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  return {
    loading, error, cancellingId,
    pendingCancelId, requestCancel, dismissCancel, confirmCancel,
    activeAppointments, pastAppointments, navigate,
  };
};

export default useAppointments;
