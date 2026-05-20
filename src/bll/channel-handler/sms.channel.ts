import { Injectable } from '@nestjs/common';
import { INotificationChannel } from '../interfaces/notification-channel.interface';
import { InjectQueue } from '@nestjs/bullmq';
import { BullQueueName } from 'src/lib/enum';
import { Queue } from 'bullmq';

@Injectable()
export class SmsChannel implements INotificationChannel {
  constructor(@InjectQueue(BullQueueName.SMS) private smsQueue: Queue) {}

  async send(log_id: number, payload: Record<string, any>): Promise<void> {
    await this.smsQueue.add(
      BullQueueName.SMS,
      {
        log_id,
        payload,
      },
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
  }
}
