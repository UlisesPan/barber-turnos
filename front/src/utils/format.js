// Fechas YYYY-MM-DD → Date local (sin el corrimiento de zona horaria de new Date('YYYY-MM-DD'))
export const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const toDateStr = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const formatLongDate = (dateStr) =>
  parseLocalDate(dateStr).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatWeekdayDate = (dateStr) =>
  parseLocalDate(dateStr).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

const priceFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
export const formatPrice = (value) => priceFormatter.format(Number(value) || 0);

export const getInitials = (name) =>
  name ? name.trim().split(/\s+/).map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
