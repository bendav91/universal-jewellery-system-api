import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1665660100524 implements MigrationInterface {
  name = 'CreateOrdersTable1665660100524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderNumber" character varying NOT NULL, "shippingAddress" character varying NOT NULL, "notes" character varying, CONSTRAINT "UQ_59b0c3b34ea0fa5562342f24143" UNIQUE ("orderNumber"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`INSERT INTO public.orders
      (id, "createdAt", "updatedAt", "orderNumber", "shippingAddress", notes)
      VALUES(1, '2022-10-13 12:26:58.774', '2022-10-13 12:26:58.774', 'UJ-EDD56B82F4', '1 Barracuda Rise, Southam, Warwickshire, CV47 1AU', 'This is a test order.');
    `);
    await queryRunner.query(`INSERT INTO public.orders
      (id, "createdAt", "updatedAt", "orderNumber", "shippingAddress", notes)
      VALUES(2, '2022-10-13 12:26:58.774', '2022-10-13 12:26:58.774', 'UJ-ABB56B82X3', '17a Lindon Street, Northampton, Northamptonshire, N45 1AZ', 'This is a test order.');
    `);
    await queryRunner.query(`INSERT INTO public.orders
      (id, "createdAt", "updatedAt", "orderNumber", "shippingAddress", notes)
      VALUES(3, '2022-10-13 12:26:58.774', '2022-10-13 12:26:58.774', 'UJ-9XX58B82D4', '354 Markum Drive, Worcester, Worcestershire, WR48 1AX', 'This is a test order.');
    `);
    await queryRunner.query(`INSERT INTO public.orders
      (id, "createdAt", "updatedAt", "orderNumber", "shippingAddress", notes)
      VALUES(4, '2022-10-13 12:26:58.774', '2022-10-13 12:26:58.774', 'UJ-E9Z56BF2Z4', 'Malin House, Saundersfoot, Pembrookeshire, PB41 1AF', 'This is a test order.');
    `);
    await queryRunner.query(`INSERT INTO public.orders
      (id, "createdAt", "updatedAt", "orderNumber", "shippingAddress", notes)
      VALUES(5, '2022-10-13 12:26:58.774', '2022-10-13 12:26:58.774', 'UJ-FDF56762F1', '8 Justice Road, Small Health, Birmingham, BN1 6AJ', 'This is a test order.');
    `);
    await queryRunner.query(`INSERT INTO public.orders
      (id, "createdAt", "updatedAt", "orderNumber", "shippingAddress", notes)
      VALUES(6, '2022-10-13 12:26:58.774', '2022-10-13 12:26:58.774', 'UJ-H2456X82F9', '11 Collingham Lane, Long Itchington, Warwickshire, CV46 1AK', 'This is a test order.');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "orders"`);
  }
}
