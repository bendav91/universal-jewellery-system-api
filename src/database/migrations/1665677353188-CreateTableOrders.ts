import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableOrders1665677353188 implements MigrationInterface {
    name = 'CreateTableOrders1665677353188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orderStatusEnum" AS ENUM('NEW', 'IN_PROGRESS', 'READY', 'DISPATCHED', 'ARRIVED', 'COMPLETE')`);
        await queryRunner.query(`CREATE TYPE "public"."paymentStatusEnum" AS ENUM('PAYMENT_PENDING', 'PAYMENT_FAILED', 'PAYMENT_NOT_REQUIRED', 'PAYMENT_FULL', 'PAYMENT_PARTIAL')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderNumber" character varying NOT NULL, "shippingAddress" character varying NOT NULL, "notes" character varying, "status" "public"."orderStatusEnum" NOT NULL DEFAULT 'NEW', "paymentStatus" "public"."paymentStatusEnum" NOT NULL DEFAULT 'PAYMENT_PENDING', CONSTRAINT "UQ_59b0c3b34ea0fa5562342f24143" UNIQUE ("orderNumber"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."paymentStatusEnum"`);
        await queryRunner.query(`DROP TYPE "public"."orderStatusEnum"`);
    }

}
