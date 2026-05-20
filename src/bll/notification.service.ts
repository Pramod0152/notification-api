import { Injectable } from '@nestjs/common';
import { BullQueueName, NotificationChannel, NotificationProviderType, NotificationStatus } from 'src/lib/enum';
import { NotificationDataService } from '../dal/notification.data.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendNotificationDto } from 'src/dto/email/send-notification.dto';
import { ChannelRegistry } from './channel-handler/channel.registry';

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

  async getLogs() {
    return this.dataService.getLogs();
  }

  async getLog(id: number) {
    return this.dataService.getLog(id);
  }
}
