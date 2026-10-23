import { Raw } from 'typeorm';

// WHERE para comparar texto sin distinguir mayúsculas (emails)
export const equalsIgnoreCase = (value: string) =>
    Raw((col) => `LOWER(${col}) = LOWER(:value)`, { value });
