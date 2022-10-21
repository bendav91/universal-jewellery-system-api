import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNetPriceFromOrderItem1666380625127
  implements MigrationInterface
{
  name = 'RemoveNetPriceFromOrderItem1666380625127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "netPrice"`);
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "netPrice" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
  }
}
