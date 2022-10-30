import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateIdempotencyKeyFromPayments1667148518174
  implements MigrationInterface
{
  name = 'GenerateIdempotencyKeyFromPayments1667148518174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "idempotencyKey" SET DEFAULT uuid_generate_v4()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "idempotencyKey" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
  }
}
