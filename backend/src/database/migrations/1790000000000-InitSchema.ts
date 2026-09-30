import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1790000000000 implements MigrationInterface {
  name = 'InitSchema1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar(320) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "quiz_versions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "quiz_key" varchar(64) NOT NULL,
        "version" integer NOT NULL,
        "status" varchar(16) NOT NULL,
        "scoring_strategy" varchar(64) NOT NULL,
        "scoring_config" jsonb NOT NULL DEFAULT '{}',
        "report_template" varchar(64) NOT NULL,
        "published_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_quiz_versions_key_version" UNIQUE ("quiz_key", "version"),
        CONSTRAINT "CHK_quiz_versions_status" CHECK ("status" IN ('draft', 'published', 'retired'))
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "questions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "quiz_version_id" uuid NOT NULL REFERENCES "quiz_versions" ("id") ON DELETE RESTRICT,
        "key" varchar(64) NOT NULL,
        "position" integer NOT NULL,
        "text" text NOT NULL,
        CONSTRAINT "UQ_questions_version_key" UNIQUE ("quiz_version_id", "key"),
        CONSTRAINT "UQ_questions_version_position" UNIQUE ("quiz_version_id", "position")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "answer_options" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "question_id" uuid NOT NULL REFERENCES "questions" ("id") ON DELETE RESTRICT,
        "key" varchar(64) NOT NULL,
        "position" integer NOT NULL,
        "label" varchar(255) NOT NULL,
        "weight" integer NOT NULL,
        CONSTRAINT "UQ_answer_options_question_key" UNIQUE ("question_id", "key"),
        CONSTRAINT "UQ_answer_options_question_position" UNIQUE ("question_id", "position")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "attempts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "quiz_version_id" uuid NOT NULL REFERENCES "quiz_versions" ("id") ON DELETE RESTRICT,
        "user_id" uuid NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "anonymous_token_hash" varchar(64) NULL,
        "gender" varchar(16) NOT NULL,
        "status" varchar(16) NOT NULL,
        "score" integer NULL,
        "level" varchar(16) NULL,
        "scoring_snapshot" jsonb NULL,
        "started_at" timestamptz NOT NULL DEFAULT now(),
        "completed_at" timestamptz NULL,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_attempts_status" CHECK ("status" IN ('in_progress', 'completed', 'abandoned')),
        CONSTRAINT "CHK_attempts_gender" CHECK ("gender" IN ('male', 'female')),
        CONSTRAINT "CHK_attempts_owner" CHECK ("user_id" IS NOT NULL OR "anonymous_token_hash" IS NOT NULL)
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_attempts_user_completed" ON "attempts" ("user_id", "completed_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_attempts_anonymous_token_hash" ON "attempts" ("anonymous_token_hash")`);
    // At most one in-progress attempt per owner.
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_attempts_user_in_progress" ON "attempts" ("user_id") WHERE "status" = 'in_progress' AND "user_id" IS NOT NULL`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_attempts_anonymous_in_progress" ON "attempts" ("anonymous_token_hash") WHERE "status" = 'in_progress' AND "anonymous_token_hash" IS NOT NULL`
    );

    await queryRunner.query(`
      CREATE TABLE "attempt_answers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "attempt_id" uuid NOT NULL REFERENCES "attempts" ("id") ON DELETE CASCADE,
        "question_id" uuid NOT NULL REFERENCES "questions" ("id") ON DELETE RESTRICT,
        "option_id" uuid NOT NULL REFERENCES "answer_options" ("id") ON DELETE RESTRICT,
        "answered_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_attempt_answers_attempt_question" UNIQUE ("attempt_id", "question_id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "attempt_answers"`);
    await queryRunner.query(`DROP TABLE "attempts"`);
    await queryRunner.query(`DROP TABLE "answer_options"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "quiz_versions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
