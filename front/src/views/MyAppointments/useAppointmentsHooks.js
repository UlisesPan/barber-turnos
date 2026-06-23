import { useEffect,useRef, useState, useContext } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/Auth/AuthContext";

const useAppointments = () => {
    const { user, token, isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const url = user.role === 'admin'
      ? '/appointments'
      : `/appointments/user/${user.id}`;

    axiosInstance
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch(() => setError('No se pudieron cargar los turnos.'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await axiosInstance.put(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
      );
    } catch {
      setError('No se pudo cancelar el turno.');
    } finally {
      setCancellingId(null);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await axiosInstance.put(`/users/${user.id}/photo`, formData);
      login({ ...user, profilePhoto: res.data.profilePhoto }, token);
    } catch {
      setError('No se pudo subir la foto.');
    }
  };

  const getInitials = () =>
    user?.name
      ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';

  const now = new Date();

const isPast = (a) => {
  const [y, m, d] = (a.date.split('T')[0]).split('-').map(Number);
  const apptDate = new Date(y, m - 1, d);
  const [h, min] = a.time.split(':').map(Number);
  apptDate.setHours(h, min, 0, 0);
  return apptDate <= now;
};

const activeAppointments = appointments.filter((a) => a.status !== 'cancelled' && !isPast(a));
const pastAppointments   = appointments.filter((a) => a.status === 'cancelled'  ||  isPast(a));
return {
  fileInputRef, loading, error, cancellingId,
  handleCancel, handlePhotoUpload, getInitials,
  activeAppointments, pastAppointments, navigate,
};
}

export default useAppointments