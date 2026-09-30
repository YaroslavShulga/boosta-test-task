import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './auth/optional-jwt-auth.guard';
import { AuthCookiesService } from './http/auth-cookies.service';

/** Cross-cutting HTTP helpers shared by every feature module. */
@Global()
@Module({
  providers: [AuthCookiesService, JwtAuthGuard, OptionalJwtAuthGuard],
  exports: [AuthCookiesService, JwtAuthGuard, OptionalJwtAuthGuard]
})
export class CommonModule {}
