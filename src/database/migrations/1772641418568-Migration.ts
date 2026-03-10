import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1772641418568 implements MigrationInterface {
  name = 'Migration1772641418568';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_group_members" DROP CONSTRAINT "FK_members_group"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" DROP CONSTRAINT "FK_messages_group"`,
    );
    await queryRunner.query(`DROP INDEX "UQ_group_user"`);
    await queryRunner.query(`DROP INDEX "IDX_members_group_id"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_group_id"`);
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "metadata" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "metadata" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "metadata" TYPE json USING "metadata"::json`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "group_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_group_members" ALTER COLUMN "group_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ADD CONSTRAINT "FK_187a01ecf9fff2bcfe2ecf4aeaf" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_group_members" ADD CONSTRAINT "FK_022c85da17c68d3047c2e6261bb" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_group_members" DROP CONSTRAINT "FK_022c85da17c68d3047c2e6261bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" DROP CONSTRAINT "FK_187a01ecf9fff2bcfe2ecf4aeaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_group_members" ALTER COLUMN "group_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "group_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "metadata" TYPE jsonb USING "metadata"::jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "metadata" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ALTER COLUMN "metadata" SET DEFAULT '{}'::jsonb`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_messages_group_id" ON "messaging_messages" ("group_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_members_group_id" ON "chat_group_members" ("group_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_group_user" ON "chat_group_members" ("group_id", "user_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "messaging_messages" ADD CONSTRAINT "FK_messages_group" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_group_members" ADD CONSTRAINT "FK_members_group" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE`,
    );
  }
}
