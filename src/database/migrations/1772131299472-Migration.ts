import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772131299472 implements MigrationInterface {
    name = 'Migration1772131299472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_groups" ("id" BIGSERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "created_by_user_id" bigint NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_99f0cb8163569cd32e8a16cbc9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messaging_messages" ("id" BIGSERIAL NOT NULL, "sender_user_id" bigint NOT NULL, "body" text NOT NULL, "message_type" character varying(50) NOT NULL DEFAULT 'text', "metadata" json, "edited_at" TIMESTAMP, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "group_id" bigint, CONSTRAINT "PK_8432ff51154218cce49022d5e35" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_group_members" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "role" character varying(50), "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "last_read_message_id" bigint, "muted_until" TIMESTAMP, "status" character varying(50), "group_id" bigint, CONSTRAINT "PK_52d8d185c5d381d83161254ebe2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messaging_messages" ADD CONSTRAINT "FK_187a01ecf9fff2bcfe2ecf4aeaf" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_group_members" ADD CONSTRAINT "FK_022c85da17c68d3047c2e6261bb" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_group_members" DROP CONSTRAINT "FK_022c85da17c68d3047c2e6261bb"`);
        await queryRunner.query(`ALTER TABLE "messaging_messages" DROP CONSTRAINT "FK_187a01ecf9fff2bcfe2ecf4aeaf"`);
        await queryRunner.query(`DROP TABLE "chat_group_members"`);
        await queryRunner.query(`DROP TABLE "messaging_messages"`);
        await queryRunner.query(`DROP TABLE "chat_groups"`);
    }

}
