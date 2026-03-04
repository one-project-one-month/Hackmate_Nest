import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1772131299472 implements MigrationInterface {
  name = 'Migration1772131299472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "chat_groups" (
        "id" BIGSERIAL PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "description" text,
        "created_by_user_id" bigint NOT NULL,
        "is_private" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "messaging_messages" (
        "id" BIGSERIAL PRIMARY KEY,
        "sender_user_id" bigint NOT NULL,
        "body" text NOT NULL,
        "message_type" varchar(50) NOT NULL DEFAULT 'text',
        "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "edited_at" TIMESTAMP,
        "deleted_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "group_id" bigint NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "chat_group_members" (
        "id" BIGSERIAL PRIMARY KEY,
        "user_id" bigint NOT NULL,
        "role" varchar(50),
        "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
        "last_read_message_id" bigint,
        "muted_until" TIMESTAMP,
        "status" varchar(50),
        "group_id" bigint NOT NULL
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "messaging_messages"
      ADD CONSTRAINT "FK_messages_group"
      FOREIGN KEY ("group_id")
      REFERENCES "chat_groups"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "chat_group_members"
      ADD CONSTRAINT "FK_members_group"
      FOREIGN KEY ("group_id")
      REFERENCES "chat_groups"("id")
      ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_messages_group_id"
      ON "messaging_messages" ("group_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_members_group_id"
      ON "chat_group_members" ("group_id")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_group_user"
      ON "chat_group_members" ("group_id", "user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UQ_group_user"`);
    await queryRunner.query(`DROP INDEX "IDX_members_group_id"`);
    await queryRunner.query(`DROP INDEX "IDX_messages_group_id"`);
    await queryRunner.query(`DROP TABLE "chat_group_members"`);
    await queryRunner.query(`DROP TABLE "messaging_messages"`);
    await queryRunner.query(`DROP TABLE "chat_groups"`);
  }
}
