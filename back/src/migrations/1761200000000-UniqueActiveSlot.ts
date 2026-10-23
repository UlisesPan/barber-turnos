import { MigrationInterface, QueryRunner } from "typeorm";

// Impide dos turnos activos en la misma fecha/hora (evita la doble reserva por race condition).
export class UniqueActiveSlot1761200000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_active_slot" ON "appointments" ("date", "time") WHERE "status" = 'active'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "UQ_active_slot"`);
    }
}
