import { join } from 'node:path';
import type { DataSourceOptions } from 'typeorm';
import type { Environment } from '../config/environment';

export function buildTypeOrmOptions(
  environment: Pick<Environment, 'DB_HOST' | 'DB_PORT' | 'DB_USERNAME' | 'DB_PASSWORD' | 'DB_NAME'>
): DataSourceOptions {
  return {
    type: 'postgres',
    host: environment.DB_HOST,
    port: environment.DB_PORT,
    username: environment.DB_USERNAME,
    password: environment.DB_PASSWORD,
    database: environment.DB_NAME,
    synchronize: false,
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsTableName: 'migrations'
  };
}
