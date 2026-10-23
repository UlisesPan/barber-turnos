import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Appointment from "./Appointments";

// pg devuelve DECIMAL como string; lo convertimos a number al leer
const decimalToNumber = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalToNumber })
  price: number;

  @Column({ nullable: true, type: 'varchar' })
  image: string | null;

  @OneToMany(() => Appointment, appointment => appointment.category)
  appointments: Appointment[];
}
