import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BullQueueName, NotificationStatus } from 'src/lib/enum';
import { TwilioService } from '../twilio.service';
import { NotificationDataService } from 'src/dal/notification.data.service';

@Processor(BullQueueName.WHATSAPP)
export class WhatsAppProcessor extends WorkerHost {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly dataService: NotificationDataService,
  ) {
    super();
  }

  async process(job: Job) {
    const { payload, log_id } = job.data;

    const log = await this.dataService.getLog(log_id);

    if (!log) {
      throw new Error('Notification log not found');
    }

    try {
      const response = await this.twilioService.sendWhatsApp({
        to: payload.to,
        body: payload.body,
        contentSid: payload.contentSid,
        templateData: payload.templateData,
      });
      await this.dataService.createLog({
        channel: log.channel,
        provider: log.provider,
        status: NotificationStatus.SENT,
        payload,
        attempts: job.attemptsMade + 1,
        queued_at: log.queued_at,
        parent_id: log.id,
        provider_msg_id: response.providerMsgId,
        last_error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.dataService.createLog({
        channel: log.channel,
        provider: log.provider,
        status: NotificationStatus.WAITING,
        payload,
        parent_id: log.id,
        last_error: message,
        attempts: job.attemptsMade + 1,
      });
      throw error;
    }
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job) {
    const { payload, log_id } = job.data;

    const log = await this.dataService.getLog(log_id);

    if (!log) {
      throw new Error('Notification log not found');
    }

    await this.dataService.createLog({
      channel: log.channel,
      provider: log.provider,
      status: NotificationStatus.FAILED,
      payload,
      parent_id: log.id,
      last_error: job.stacktrace?.join('; ') ?? null,
      attempts: job.attemptsMade,
      queued_at: log.queued_at,
    });
  }
}
