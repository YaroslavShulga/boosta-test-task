import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';

/**
 * HTTP exception with a stable error code.
 * Response body: `{ statusCode, code, message }`.
 */
export class AppException extends HttpException {
  constructor(status: HttpStatus, code: ErrorCode, message: string) {
    super({ statusCode: status, code, message }, status);
  }
}
