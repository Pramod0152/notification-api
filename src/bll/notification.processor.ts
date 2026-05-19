import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BullQueueName } from 'src/lib/enum';
import { NotificationService } from './notification.service';
import { SendGridService } from './sendgrid.service';

@Processor(BullQueueName.EMAIL)
export class NotificationProcessor extends WorkerHost {
  constructor(private readonly sendGridService: SendGridService) {
    super();
  }

  async process(job: Job) {
    const { payload } = job.data;
    try {
      await this.sendGridService.sendMessage(payload);
    } catch (error) {
      console.error('Error processing job:', error);
      throw error;
    }
  }
}
