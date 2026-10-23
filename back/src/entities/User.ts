import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Credentials from "./Credentials";
import Appointment from "./Appointments";

@Entity({ name: "users" })
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    birthdate: Date;

    @Column()
    nDni: number;

    @Column({ nullable: true, type: 'varchar' })
    profilePhoto: string | null;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: 'user' | 'admin';

    // Sin eager: las credenciales no deben viajar con el usuario
    @OneToOne(() => Credentials, credential => credential.user, { cascade: true })
    @JoinColumn()
    credentials: Credentials;

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];
}

export default User;
