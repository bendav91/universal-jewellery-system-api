import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaxesManyToMany1666377551090 implements MigrationInterface {
  name = 'AddTaxesManyToMany1666377551090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tax" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(50) NOT NULL DEFAULT 'VAT', "rate" numeric(10,2) NOT NULL DEFAULT '0.2', "description" character varying(50) NOT NULL DEFAULT 'UK VAT Rate', CONSTRAINT "PK_2c1e62c595571139e2fb0e9c319" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item_taxes_tax" ("orderItemId" integer NOT NULL, "taxId" integer NOT NULL, CONSTRAINT "PK_bc9500e7f5b8a2c3a5dc5929624" PRIMARY KEY ("orderItemId", "taxId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c9aabbeb3c2262efa82da478f0" ON "order_item_taxes_tax" ("orderItemId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_729bf0e57939295597817ee6ed" ON "order_item_taxes_tax" ("taxId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_taxes_tax" ADD CONSTRAINT "FK_c9aabbeb3c2262efa82da478f02" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_taxes_tax" ADD CONSTRAINT "FK_729bf0e57939295597817ee6eda" FOREIGN KEY ("taxId") REFERENCES "tax"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item_taxes_tax" DROP CONSTRAINT "FK_729bf0e57939295597817ee6eda"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_taxes_tax" DROP CONSTRAINT "FK_c9aabbeb3c2262efa82da478f02"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_729bf0e57939295597817ee6ed"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c9aabbeb3c2262efa82da478f0"`,
    );
    await queryRunner.query(`DROP TABLE "order_item_taxes_tax"`);
    await queryRunner.query(`DROP TABLE "tax"`);
  }
}
