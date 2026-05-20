import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseError } from '@sendgrid/helpers/classes';
import { NotificationPayload } from 'src/bll/interfaces/notification-provider.interface';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private client: MailService;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.client = new MailService();
    this.client.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendEmail(payload: NotificationPayload) {
    try {
      const message = {
        to: {
          email: payload.to,
        },
        from: {
          email: this.configService.get<string>('SENDGRID_FROM_EMAIL'),
        },
        templateId: payload.templateId,
        dynamicTemplateData: payload.templateData,
      };
      const [response] = await this.client.send(message);
      const providerMsgId = response.headers['x-message-id'];

      return {
        success: true,
        providerMsgId,
      };
    } catch (error) {
      const message = this.extractErrorMessage(error);
      throw new Error(message);
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
