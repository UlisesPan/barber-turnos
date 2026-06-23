export const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
//Función para validar que el horario esté dentro de los rangos permitidos
export const isValidTimeSlot = (time: string): boolean => {
    const regex = timeRegex;

    if (!regex.test(time)) return false;

   const [hour, minute] = time.split(':').map(Number);

  const isMorning = hour >= 10 && hour < 13;
  const isAfternoon = hour >= 16 && hour < 20;

return (isMorning || isAfternoon) && (minute === 0 || minute === 30);
}

export const getTimeSlotErrorMessage = (): string => {
    return "Los horarios válidos son de 10:00 a 13:00 o de 16:00 a 20:00.";
};

// Usa la cadena YYYY-MM-DD para evitar problemas de zona horaria al construir la fecha
export const isValidWeekday = (date: Date | string): boolean => {
    const dateString = typeof date === 'string'
        ? date.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? ''
        : formatDateToString(date);
    const [year, month, day] = dateString.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const dow = localDate.getDay();
    return dow >= 1 && dow <= 4;
};

export const getWeekdayErrorMessage = (): string => {
    return "Solo se pueden agendar turnos de lunes a jueves.";
};

//Convierte una fecha y hora en un timestamp para comparación
export const formatDateToString = (date: Date | string): string => {
  if (typeof date === 'string') {
    // Captura YYYY-MM-DD esté o no seguido de T... (ISO string)
    const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1]; // ✅ Devuelve solo la parte YYYY-MM-DD
    date = new Date(date);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const validateNoConflictAppointment = async (

  existingAppointments: any[],
  newDate: Date | string,
  newTime: string
): Promise<boolean> => {
  const newDateString = formatDateToString(newDate);
  
  for (const appointment of existingAppointments) {
    // Ignorar turnos cancelados
    if (appointment.status === 'cancelled') continue;
    
    // Validar que el horario almacenado sea válido
    if (!isValidTimeSlot(appointment.time)) continue;
    
    // Comparar fecha en formato string (YYYY-MM-DD)
    const existingDateString = formatDateToString(appointment.date);
    
    // Si la fecha es igual Y la hora es igual, hay conflicto
    if (existingDateString === newDateString && appointment.time === newTime) {
      console.log(`   ❌ CONFLICTO ENCONTRADO`);
      return false; 
    }
    console.log('newDateString:', newDateString);
  console.log('existingDateString:', existingDateString);
  console.log('newTime:', newTime);
  console.log('appointment.time:', appointment.time);
  }
 console.log(`   ✅ No hay conflictos`);
  return true; 
};