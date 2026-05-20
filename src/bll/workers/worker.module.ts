import { Module } from '@nestjs/common';
import { EmailProcessor } from './email.processor';
import { SmsProcessor } from './sms.processor';
import { WhatsAppProcessor } from './whatsapp.processor';
import { SendGridService } from '../sendgrid.service';
import { TwilioService } from '../twilio.service';

@Module({
  providers: [EmailProcessor, SmsProcessor, WhatsAppProcessor, SendGridService, TwilioService],
})
export class WorkerModule {}
