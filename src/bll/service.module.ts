import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendGridService } from './sendgrid.service';

@Global()
@Module({
  providers: [NotificationService, SendGridService],
  exports: [NotificationService, SendGridService],
})
export class ServiceModule {}
