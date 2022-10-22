import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersTable1666437684575 implements MigrationInterface {
  name = 'UsersTable1666437684575';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."userTypeEnum" AS ENUM('staff', 'customer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying(80) NOT NULL, "userType" "public"."userTypeEnum" NOT NULL DEFAULT 'customer', "provider" character varying(80) NOT NULL, "lastLogin" TIMESTAMP NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."userTypeEnum"`);
  }
}
