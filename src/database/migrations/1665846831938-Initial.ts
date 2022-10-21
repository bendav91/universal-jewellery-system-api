import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1665846831938 implements MigrationInterface {
  name = 'Initial1665846831938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orderItemTypeEnum" AS ENUM('BESPOKE', 'STOCK', 'MADE_TO_ORDER', 'SERVICE', 'UNKNOWN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "orderItemNumber" character varying NOT NULL, "status" "public"."orderItemTypeEnum" NOT NULL DEFAULT 'UNKNOWN', "orderId" integer, CONSTRAINT "UQ_ed2ed5fa070e47a943b042b64d4" UNIQUE ("orderItemNumber"), CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orderStatusEnum" AS ENUM('NEW', 'IN_PROGRESS', 'READY', 'DISPATCHED', 'ARRIVED', 'COMPLETE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."paymentStatusEnum" AS ENUM('PAYMENT_PENDING', 'PAYMENT_FAILED', 'PAYMENT_NOT_REQUIRED', 'PAYMENT_FULL', 'PAYMENT_PARTIAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "orderNumber" character varying NOT NULL, "shippingAddress" character varying NOT NULL, "notes" character varying, "status" "public"."orderStatusEnum" NOT NULL DEFAULT 'NEW', "paymentStatus" "public"."paymentStatusEnum" NOT NULL DEFAULT 'PAYMENT_PENDING', CONSTRAINT "UQ_4e9f8dd16ec084bca97b3262edb" UNIQUE ("orderNumber"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."paymentStatusEnum"`);
    await queryRunner.query(`DROP TYPE "public"."orderStatusEnum"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TYPE "public"."orderItemTypeEnum"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
