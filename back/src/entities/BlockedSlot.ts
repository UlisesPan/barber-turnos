import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'blocked_slots' })
class BlockedSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true, type: 'varchar' })
  time: string | null; // null = día entero bloqueado

  @Column({ nullable: true, type: 'varchar' })
  reason: string | null;
}

export default BlockedSlot;