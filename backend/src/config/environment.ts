import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
  validateSync
} from 'class-validator';

const toBoolean = ({ value }: { value: unknown }): unknown => (typeof value === 'string' ? value === 'true' : value);

export class Environment {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  PORT = 3000;

  @IsString()
  @IsNotEmpty()
  DB_HOST = 'localhost';

  @Type(() => Number)
  @IsInt()
  DB_PORT = 5432;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME = 'postgres';

  @IsString()
  DB_PASSWORD = 'postgres';

  @IsString()
  @IsNotEmpty()
  DB_NAME = 'app';

  @Transform(toBoolean)
  @IsBoolean()
  DB_MIGRATIONS_RUN = true;

  @IsString()
  @MinLength(16)
  JWT_SECRET: string;

  /** Access token lifetime in seconds. */
  @Type(() => Number)
  @IsInt()
  @Min(60)
  JWT_TTL = 60 * 60 * 24 * 7;

  /** Comma-separated list of allowed frontend origins. */
  @IsString()
  CORS_ORIGIN = 'http://localhost:3001';

  /**
   * Express `trust proxy` setting. The frontend proxies `/api/*` to this API, so the
   * client IP (used by the rate limiter) comes from X-Forwarded-For set by trusted hops.
   */
  @IsString()
  TRUST_PROXY = 'loopback, linklocal, uniquelocal';

  @Transform(toBoolean)
  @IsBoolean()
  COOKIE_SECURE = false;

  @IsIn(['lax', 'strict', 'none'])
  COOKIE_SAMESITE: 'lax' | 'strict' | 'none' = 'lax';

  @IsOptional()
  @IsString()
  COOKIE_DOMAIN?: string;
}

export function validateEnvironment(config: Record<string, unknown>): Environment {
  const environment = plainToInstance(Environment, config, {
    enableImplicitConversion: false
  });
  const errors = validateSync(environment, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(
      `Invalid environment configuration:\n${errors
        .map((error) => Object.values(error.constraints ?? {}).join(', '))
        .join('\n')}`
    );
  }
  return environment;
}
