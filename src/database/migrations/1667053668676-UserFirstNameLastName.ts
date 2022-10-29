import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFirstNameLastName1667053668676 implements MigrationInterface {
  name = 'UserFirstNameLastName1667053668676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying NOT NULL DEFAULT 'No First Name'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying NOT NULL DEFAULT 'No Last Name'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
  }
}
