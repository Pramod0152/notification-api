import { Injectable } from '@nestjs/common';
import { NotificationChannel, NotificationProviderType, NotificationStatus } from 'src/lib/enum';
import { NotificationDataService } from '../dal/notification.data.service';
import { SendNotificationDto } from 'src/dto/email/send-notification.dto';
import { ChannelRegistry } from './channel-handler/channel.registry';
import { PaginationDto } from 'src/dto/pagination.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly dataService: NotificationDataService,
    private readonly channelRegistry: ChannelRegistry,
  ) {}

  async sendNotification(item: SendNotificationDto) {
    let payload = {
      to: item.to,
      subject: item.subject,
      body: item.body,
      templateId: item.templateId,
      templateData: item.templateData,
    };

    const providerMap: Partial<Record<NotificationChannel, NotificationProviderType>> = {
      [NotificationChannel.EMAIL]: NotificationProviderType.SENDGRID,
    };

    const log = await this.dataService.createLog({
      channel: item.channel,
      provider: providerMap[item.channel],
      status: NotificationStatus.QUEUED,
      payload,
      attempts: 0,
      queued_at: new Date(),
    });

    const channel = this.channelRegistry.resolve(item.channel);
    await channel.send(log.id, payload);

    return {
      message: 'Notification sent successfully',
    };
  }

  async getLogs(query: PaginationDto) {
    return this.dataService.getLogs(query);
  }

  async getLog(id: number) {
    return this.dataService.getLog(id);
  }
}
