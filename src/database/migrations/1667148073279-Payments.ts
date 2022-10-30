import { MigrationInterface, QueryRunner } from 'typeorm';

export class Payments1667148073279 implements MigrationInterface {
  name = 'Payments1667148073279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."paymentTypeEnum" AS ENUM('Bank Transfer', 'Cash', 'Cheque', 'Credit Card', 'Debit Card', 'Online', 'Refund', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "idempotencyKey" uuid NOT NULL, "paymentType" "public"."paymentTypeEnum" NOT NULL DEFAULT 'Other', "paymentProvider" character varying, "paymentProviderReference" character varying, "amount" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_payments_payment" ("orderId" integer NOT NULL, "paymentId" integer NOT NULL, CONSTRAINT "PK_e3569eec241aab966ef9243181e" PRIMARY KEY ("orderId", "paymentId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a630be3ec93fc4a3e49508f00" ON "order_payments_payment" ("orderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3bdd411fe2602978f76b27d262" ON "order_payments_payment" ("paymentId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "paymentGatewayCustomerId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_payments_payment" ADD CONSTRAINT "FK_1a630be3ec93fc4a3e49508f00f" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_payments_payment" ADD CONSTRAINT "FK_3bdd411fe2602978f76b27d2625" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_payments_payment" DROP CONSTRAINT "FK_3bdd411fe2602978f76b27d2625"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_payments_payment" DROP CONSTRAINT "FK_1a630be3ec93fc4a3e49508f00f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "paymentGatewayCustomerId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3bdd411fe2602978f76b27d262"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a630be3ec93fc4a3e49508f00"`,
    );
    await queryRunner.query(`DROP TABLE "order_payments_payment"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."paymentTypeEnum"`);
  }
}
