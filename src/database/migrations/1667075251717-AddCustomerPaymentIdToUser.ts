import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerPaymentIdToUser1667075251717
  implements MigrationInterface
{
  name = 'AddCustomerPaymentIdToUser1667075251717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "paymentGatewayCustomerId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "paymentGatewayCustomerId"`,
    );
  }
}
