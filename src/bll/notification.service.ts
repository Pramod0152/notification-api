import { Injectable } from '@nestjs/common';
import { BullQueueName, NotificationProviderType, NotificationStatus } from 'src/lib/enum';
import { NotificationDataService } from '../dal/notification.data.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendNotificationDto } from 'src/dto/email/send-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly dataService: NotificationDataService,
    @InjectQueue(BullQueueName.EMAIL) private emailQueue: Queue,
  ) {}

  async sendNotification(item: SendNotificationDto) {
    let payload = {
      to: item.to,
      subject: item.subject,
      body: item.body,
      templateId: item.templateId,
      templateData: item.templateData,
      logId: null,
    };

    const log = await this.dataService.createLog({
      channel: item.channel,
      provider: NotificationProviderType.SENDGRID,
      status: NotificationStatus.QUEUED,
      payload,
      attempts: 0,
      queuedAt: new Date(),
    });

    payload.logId = log.id;

    await this.emailQueue.add(
      BullQueueName.EMAIL,
      { payload },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 60 * 60 * 24,
        },
        removeOnFail: {
          age: 60 * 60 * 24 * 7,
        },
      },
    );

    return {
      message: 'Notification sent successfully',
    };
  }
}
