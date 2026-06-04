import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import Appointment from "./Appointments";

@Entity({
    name: "categories"
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column()
  duration: number; 
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
 @OneToMany(() => Appointment, appointment => appointment.category)
  appointments: Appointment[];
}