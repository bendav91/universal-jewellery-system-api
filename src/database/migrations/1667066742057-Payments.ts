import { MigrationInterface, QueryRunner } from "typeorm";

export class Payments1667066742057 implements MigrationInterface {
    name = 'Payments1667066742057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."paymentTypeEnum" AS ENUM('Bank Transfer', 'Cash', 'Cheque', 'Credit Card', 'Debit Card', 'Online', 'Refund', 'Other')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "paymentId" uuid NOT NULL, "idempotencyKey" uuid NOT NULL, "paymentType" "public"."paymentTypeEnum" NOT NULL DEFAULT 'Other', "paymentProvider" character varying, "paymentProviderReference" character varying, "amount" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_651693ef8bfa395e17e9a8ef049" PRIMARY KEY ("id", "paymentId"))`);
        await queryRunner.query(`CREATE TABLE "order_payments_payment" ("orderId" integer NOT NULL, "paymentId" integer NOT NULL, "paymentPaymentId" uuid NOT NULL, CONSTRAINT "PK_705bff9694efb0a2cf0d5925d21" PRIMARY KEY ("orderId", "paymentId", "paymentPaymentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1a630be3ec93fc4a3e49508f00" ON "order_payments_payment" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dff5ea3ef590f2a272a5bb667e" ON "order_payments_payment" ("paymentId", "paymentPaymentId") `);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`);
        await queryRunner.query(`ALTER TABLE "order_payments_payment" ADD CONSTRAINT "FK_1a630be3ec93fc4a3e49508f00f" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_payments_payment" ADD CONSTRAINT "FK_dff5ea3ef590f2a272a5bb667e2" FOREIGN KEY ("paymentId", "paymentPaymentId") REFERENCES "payment"("id","paymentId") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_payments_payment" DROP CONSTRAINT "FK_dff5ea3ef590f2a272a5bb667e2"`);
        await queryRunner.query(`ALTER TABLE "order_payments_payment" DROP CONSTRAINT "FK_1a630be3ec93fc4a3e49508f00f"`);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dff5ea3ef590f2a272a5bb667e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1a630be3ec93fc4a3e49508f00"`);
        await queryRunner.query(`DROP TABLE "order_payments_payment"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."paymentTypeEnum"`);
    }

}
