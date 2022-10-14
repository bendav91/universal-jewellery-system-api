import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderTables1665751422215 implements MigrationInterface {
    name = 'OrderTables1665751422215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orderItemTypeEnum" AS ENUM('BESPOKE', 'STOCK', 'MADE_TO_ORDER', 'SERVICE', 'UNKNOWN')`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderItemNumber" character varying NOT NULL, "status" "public"."orderItemTypeEnum" NOT NULL DEFAULT 'UNKNOWN', "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_ed2ed5fa070e47a943b042b64d4" UNIQUE ("orderItemNumber"), CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orderStatusEnum" AS ENUM('NEW', 'IN_PROGRESS', 'READY', 'DISPATCHED', 'ARRIVED', 'COMPLETE')`);
        await queryRunner.query(`CREATE TYPE "public"."paymentStatusEnum" AS ENUM('PAYMENT_PENDING', 'PAYMENT_FAILED', 'PAYMENT_NOT_REQUIRED', 'PAYMENT_FULL', 'PAYMENT_PARTIAL')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderNumber" character varying NOT NULL, "shippingAddress" character varying NOT NULL, "notes" character varying, "status" "public"."orderStatusEnum" NOT NULL DEFAULT 'NEW', "paymentStatus" "public"."paymentStatusEnum" NOT NULL DEFAULT 'PAYMENT_PENDING', CONSTRAINT "UQ_4e9f8dd16ec084bca97b3262edb" UNIQUE ("orderNumber"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."paymentStatusEnum"`);
        await queryRunner.query(`DROP TYPE "public"."orderStatusEnum"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TYPE "public"."orderItemTypeEnum"`);
    }

}
