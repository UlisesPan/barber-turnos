import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Credentials from "./Credentials";
import Appointment from "./Appointments";

@Entity(
    {name: "users"}
)
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

    @Column({ nullable: true })
    profilePhoto?: string;   

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: 'user' | 'admin';

    @OneToOne(() => Credentials,credential => credential.user, {
        eager: true, // ✅ Carga automática de las credenciales con cada usuario
        cascade: true // ✅ Permite crear/actualizar credenciales al crear/actualizar usuario
    })
    @JoinColumn()
    credentials: Credentials;

    @OneToMany(() => Appointment, (appointment) => appointment.user,
        { 
            eager: false
        })
    appointments: Appointment[];
}


export default User;