import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AppException } from '../../../../common/errors/app.exception';
import { ErrorCode } from '../../../../common/errors/error-code';
import { REPORT_TEMPLATES } from '../../reports.constants';
import type { ReportTemplate } from '../interfaces/report-template.interface';

@Injectable()
export class ReportTemplateRegistry {
  private readonly templates: Map<string, ReportTemplate>;

  constructor(@Inject(REPORT_TEMPLATES) templates: ReportTemplate[]) {
    this.templates = new Map(templates.map((template) => [template.key, template]));
  }

  get(key: string): ReportTemplate {
    const template = this.templates.get(key);
    if (!template) {
      throw new AppException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.ReportTemplateNotFound,
        `Report template "${key}" is not registered.`
      );
    }
    return template;
  }
}
