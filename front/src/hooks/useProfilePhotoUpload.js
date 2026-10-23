import { useRef, useState } from 'react';
import { useAuth } from '../context/Auth/AuthContext';
import { uploadPhoto } from '../services/userService';
import { apiErrorMessage } from '../api/axiosInstance';

// Lógica compartida de "cambiar foto de perfil" (Navbar y Mis Turnos)
const useProfilePhotoUpload = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const openPicker = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const data = await uploadPhoto(user.id, file);
      updateUser({ profilePhoto: data.profilePhoto });
    } catch (err) {
      setUploadError(apiErrorMessage(err, 'No se pudo subir la foto.'));
    } finally {
      setUploading(false);
    }
  };

  return { fileInputRef, openPicker, handleFileChange, uploading, uploadError };
};

export default useProfilePhotoUpload;
