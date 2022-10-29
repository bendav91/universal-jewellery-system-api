import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserOrderRelationship1667052874914 implements MigrationInterface {
  name = 'UserOrderRelationship1667052874914';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "userId" character varying(80)`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT '0.2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tax" ALTER COLUMN "rate" SET DEFAULT 0.2`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`);
  }
}
