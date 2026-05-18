import { Injectable } from '@nestjs/common';
import { NotificationChannel, NotificationProviderType, NotificationStatus } from 'src/lib/enum';
import { NotificationDataService } from '../dal/notification.data.service';
import { SendGridService } from './sendgrid.service';
import { SendEmailDto } from '../dto/email/send-email.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly sendGridService: SendGridService,
    private readonly dataService: NotificationDataService,
  ) {}

  async sendEmail(payload: SendEmailDto) {
    const log = await this.dataService.createLog({
      channel: NotificationChannel.EMAIL,
      provider: NotificationProviderType.SENDGRID,
      status: NotificationStatus.QUEUED,
      payload: payload as unknown as Record<string, unknown>,
      queuedAt: new Date(),
    });

    const result = await this.sendGridService.sendMessage({
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
      templateId: payload.templateId,
      templateData: payload.templateData,
    });

    await this.dataService.updateLog(log.id, {
      status: result.success ? NotificationStatus.SENT : NotificationStatus.FAILED,
      providerMsgId: result.providerMsgId,
      lastError: result.error,
      attempts: 1,
    });

    return result;
  }
}
