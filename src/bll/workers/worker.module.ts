import { Module } from '@nestjs/common';
import { EmailProcessor } from './email.processor';
import { SendGridService } from '../sendgrid.service';

@Module({
  providers: [EmailProcessor, SendGridService],
})
export class WorkerModule {}
