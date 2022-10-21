import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPricesToOrderItems1666375548322 implements MigrationInterface {
  name = 'AddPricesToOrderItems1666375548322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "grossPrice" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "discountAmount" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "netPrice" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "netPrice"`);
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP COLUMN "discountAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP COLUMN "grossPrice"`,
    );
  }
}
