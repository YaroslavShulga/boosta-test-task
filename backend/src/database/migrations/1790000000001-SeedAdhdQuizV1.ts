import type { MigrationInterface, QueryRunner } from 'typeorm';

// Quiz definitions are immutable once published: a change to questions,
// options or scoring ships as a new migration that inserts version 2,
// publishes it and retires version 1. Existing attempts keep pointing to v1.

const QUIZ_KEY = 'adhd';
const VERSION = 1;

const OPTIONS = [
  { key: 'strongly-agree', label: 'Strongly agree', weight: 4 },
  { key: 'agree', label: 'Agree', weight: 3 },
  { key: 'neutral', label: 'Neutral', weight: 2 },
  { key: 'disagree', label: 'Disagree', weight: 1 },
  { key: 'strongly-disagree', label: 'Strongly Disagree', weight: 0 }
];

const QUESTIONS = [
  {
    key: 'lose-track-of-time',
    text: 'I easily lose track of time when doing something I enjoy'
  },
  {
    key: 'misplace-things',
    text: 'I often misplace things like my phone, keys, or wallet'
  },
  {
    key: 'unfinished-tasks',
    text: 'I frequently start tasks but struggle to finish them'
  },
  {
    key: 'focus-in-conversations',
    text: 'I find it hard to stay focused during conversations or meetings'
  },
  {
    key: 'forget-daily-tasks',
    text: 'I often forget about daily tasks like appointments or returning calls'
  }
];

export class SeedAdhdQuizV11790000000001 implements MigrationInterface {
  name = 'SeedAdhdQuizV11790000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const [version] = (await queryRunner.query(
      `INSERT INTO "quiz_versions"
         ("quiz_key", "version", "status", "scoring_strategy", "scoring_config", "report_template", "published_at")
       VALUES ($1, $2, 'published', 'linear-agreement', $3, 'adhd-v1', now())
       RETURNING "id"`,
      [QUIZ_KEY, VERSION, JSON.stringify({ highThreshold: 60 })]
    )) as { id: string }[];

    for (const [questionIndex, question] of QUESTIONS.entries()) {
      const [row] = (await queryRunner.query(
        `INSERT INTO "questions" ("quiz_version_id", "key", "position", "text")
         VALUES ($1, $2, $3, $4)
         RETURNING "id"`,
        [version.id, question.key, questionIndex + 1, question.text]
      )) as { id: string }[];

      for (const [optionIndex, option] of OPTIONS.entries()) {
        await queryRunner.query(
          `INSERT INTO "answer_options" ("question_id", "key", "position", "label", "weight")
           VALUES ($1, $2, $3, $4, $5)`,
          [row.id, option.key, optionIndex + 1, option.label, option.weight]
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const params = [QUIZ_KEY, VERSION];
    const versionFilter = `SELECT "id" FROM "quiz_versions" WHERE "quiz_key" = $1 AND "version" = $2`;
    await queryRunner.query(
      `DELETE FROM "answer_options" WHERE "question_id" IN (SELECT "id" FROM "questions" WHERE "quiz_version_id" IN (${versionFilter}))`,
      params
    );
    await queryRunner.query(`DELETE FROM "questions" WHERE "quiz_version_id" IN (${versionFilter})`, params);
    await queryRunner.query(`DELETE FROM "quiz_versions" WHERE "quiz_key" = $1 AND "version" = $2`, params);
  }
}
