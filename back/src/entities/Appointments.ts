import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import User from "./User";
import { Category } from "./Category";

@Entity({name: "appointments"})
class Appointment {
     @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  time: string;

  @ManyToOne(() => User, (user) => user.appointments, {
    eager: true, // ✅ Carga automática del usuario con cada cita
    onDelete: 'CASCADE', // ✅ Si se elimina usuario, se eliminan citas
  })
  user: User;

  @ManyToOne(() => Category, (category) => category.appointments, {
    eager: true, // ✅ Carga automática de la categoría con cada cita
    onDelete: 'RESTRICT' // ✅ No permite eliminar categoría si hay citas
  })
  category: Category;

  @Column({ type: 'enum', enum: ['active', 'cancelled', 'completed'] })
  status: 'active' | 'cancelled' | 'completed';
}

export default Appointment;