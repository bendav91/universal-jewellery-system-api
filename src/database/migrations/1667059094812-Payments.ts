import { MigrationInterface, QueryRunner } from 'typeorm';

export class Payments1667059094812 implements MigrationInterface {
  name = 'Payments1667059094812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."paymentTypeEnum" AS ENUM('Bank Transfer', 'Cash', 'Cheque', 'Credit Card', 'Debit Card', 'Online', 'Refund', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "paymentId" uuid NOT NULL, "idempotencyKey" uuid NOT NULL, "paymentType" "public"."paymentTypeEnum" NOT NULL DEFAULT 'Other', "paymentProvider" character varying, "paymentProviderReference" character varying, "amount" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_651693ef8bfa395e17e9a8ef049" PRIMARY KEY ("id", "paymentId"))`,
    );
    await queryRunner.query(`ALTER TABLE "order" ADD "paymentsId" integer`);
    await queryRunner.query(`ALTER TABLE "order" ADD "paymentsPaymentId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_e692a81b7a4debed6a92fbc11cb" FOREIGN KEY ("paymentsId", "paymentsPaymentId") REFERENCES "payment"("id","paymentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_e692a81b7a4debed6a92fbc11cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "paymentsPaymentId"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentsId"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."paymentTypeEnum"`);
  }
}
