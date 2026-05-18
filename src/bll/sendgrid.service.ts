import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseError } from '@sendgrid/helpers/classes';
import { LoggerService } from 'src/app/common/logger/logger';
import { NotificationPayload } from 'src/bll/interfaces/notification-provider.interface';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private client: MailService;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.client = new MailService();
    this.client.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendMessage(payload: NotificationPayload) {
    try {
      const message = payload.templateId
        ? {
            to: payload.to,
            from: this.configService.get<string>('SENDGRID_FROM_EMAIL'),
            templateId: payload.templateId,
            dynamicTemplateData: payload.templateData ?? {},
          }
        : {
            to: payload.to,
            from: this.configService.get<string>('SENDGRID_FROM_EMAIL'),
            subject: payload.subject ?? '(no subject)',
            html: payload.body,
          };

      const [response] = await this.client.send(message);
      const providerMsgId = response.headers['x-message-id'];

      return {
        success: true,
        providerMsgId,
      };
    } catch (error) {
      const statusCode = error instanceof ResponseError ? error.code : undefined;
      const message = this.extractErrorMessage(error);
      this.logger.error(`SendGridProvider.sendMessage failed: ${message}`);
      return {
        success: false,
        error: message,
        statusCode,
      };
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof ResponseError) {
      const body = error.response?.body as { errors?: { message: string }[] };
      if (body?.errors?.length) {
        return body.errors.map((entry) => entry.message).join('; ');
      }
      return error.message || 'SendGrid request failed';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown SendGrid error';
  }
}
