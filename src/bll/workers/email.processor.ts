import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BullQueueName, NotificationStatus } from 'src/lib/enum';
import { SendGridService } from '../sendgrid.service';
import { NotificationDataService } from 'src/dal/notification.data.service';

@Processor(BullQueueName.EMAIL)
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly sendGridService: SendGridService,
    private readonly dataService: NotificationDataService,
  ) {
    super();
  }

  async process(job: Job) {
    const { payload } = job.data;
    const logId = payload.logId;
    try {
      const response = await this.sendGridService.sendEmail(payload);
      await this.dataService.updateLog(logId, {
        status: NotificationStatus.SENT,
        providerMsgId: response.providerMsgId,
        lastError: null,
        attempts: job.attemptsMade + 1,
      });
    } catch (error) {
      await this.dataService.updateLog(logId, {
        status: NotificationStatus.FAILED,
        lastError: job.stacktrace?.join('; '),
        attempts: job.attemptsMade + 1,
      });
      throw error;
    }
  }
}
