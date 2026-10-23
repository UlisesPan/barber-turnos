import { Column, PrimaryGeneratedColumn, Entity, OneToOne } from "typeorm";
import User from "./User";

@Entity({name: "credentials"})
class Credential {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    username: string;
    // select: false → el hash nunca sale en un find() salvo que se pida explícitamente
    @Column({ select: false })
    password: string;
    @OneToOne(() => User, user => user.credentials)
    user: User;
}

export default Credential;
