import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from "typeorm";
import User from "./User";
import { Category } from "./Category";

export type AppointmentStatus = 'active' | 'cancelled' | 'completed';

// Índice único parcial: impide a nivel DB dos turnos activos en el mismo horario
@Index('UQ_active_slot', ['date', 'time'], { unique: true, where: `"status" = 'active'` })
@Entity({ name: "appointments" })
class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  // string YYYY-MM-DD: evita corrimientos de zona horaria
  @Column({ type: 'date' })
  date: string;

  @Column()
  time: string;

  @ManyToOne(() => User, (user) => user.appointments, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Category, (category) => category.appointments, { eager: true, onDelete: 'RESTRICT' })
  category: Category;

  @Column({ type: 'enum', enum: ['active', 'cancelled', 'completed'] })
  status: AppointmentStatus;
}

export default Appointment;
