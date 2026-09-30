import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm.config';

// Used by the TypeORM CLI (migration:run / generate / revert).
// Reads the same DB_* variables as the application, from .env when present.
if (existsSync(join(process.cwd(), '.env'))) {
  process.loadEnvFile();
}

export default new DataSource({
  ...buildTypeOrmOptions({
    DB_HOST: process.env.DB_HOST ?? 'localhost',
    DB_PORT: Number(process.env.DB_PORT ?? 5432),
    DB_USERNAME: process.env.DB_USERNAME ?? 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
    DB_NAME: process.env.DB_NAME ?? 'app'
  }),
  logging: false,
  entities: [join(__dirname, '..', '**', '*.orm-entity.{ts,js}')]
});
