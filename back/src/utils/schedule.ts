import { BUSINESS_TZ } from '../config/envs';

// Única fuente de verdad del horario de atención (el front la consume vía GET /appointments/schedule)
export const SCHEDULE = {
    workingDays: [1, 2, 3, 4], // lunes a jueves (0 = domingo)
    slots: {
        morning: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30'],
        afternoon: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'],
    },
};

export const ALL_SLOTS = [...SCHEDULE.slots.morning, ...SCHEDULE.slots.afternoon];

export const isValidTimeSlot = (time: string): boolean => ALL_SLOTS.includes(time);

export const TIME_SLOT_ERROR = 'Los horarios válidos son de 10:00 a 13:00 o de 16:00 a 20:00, cada 30 minutos.';
export const WEEKDAY_ERROR = 'Solo se pueden agendar turnos de lunes a jueves.';

// Día de la semana de una fecha YYYY-MM-DD, sin depender de la zona horaria del servidor
export const isValidWeekday = (dateStr: string): boolean => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    return SCHEDULE.workingDays.includes(dow);
};

// Fecha y hora actuales en Argentina, como strings comparables: { date: 'YYYY-MM-DD', time: 'HH:MM' }
export const nowInBusinessTz = (): { date: string; time: string } => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: BUSINESS_TZ,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type: string) => parts.find(p => p.type === type)!.value;
    return { date: `${get('year')}-${get('month')}-${get('day')}`, time: `${get('hour')}:${get('minute')}` };
};

// true si fecha+hora ya pasaron en hora argentina
export const isPastSlot = (date: string, time: string): boolean => {
    const now = nowInBusinessTz();
    return date < now.date || (date === now.date && time <= now.time);
};

// Normaliza Date | string a YYYY-MM-DD
export const toDateString = (date: Date | string): string => {
    if (typeof date === 'string') return date.slice(0, 10);
    return date.toISOString().slice(0, 10);
};
