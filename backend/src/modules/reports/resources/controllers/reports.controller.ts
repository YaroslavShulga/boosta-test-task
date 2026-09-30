import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { CurrentUser } from '../../../../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { ReportsService } from '../../domain/services/reports.service';
import { GetReportResponse } from '../responses/get-report.response';

/** Reports are visible to their owner only. */
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /** The report for the user's current (latest completed) attempt. */
  @Get('current')
  async getCurrent(@CurrentUser() user: AuthenticatedUser): Promise<GetReportResponse> {
    return GetReportResponse.fromEntity(await this.reportsService.getCurrent(user.id));
  }

  /** The report for a specific earlier attempt of the user. */
  @Get(':attemptId')
  async getForAttempt(
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<GetReportResponse> {
    return GetReportResponse.fromEntity(await this.reportsService.getForAttempt(user.id, attemptId));
  }
}
