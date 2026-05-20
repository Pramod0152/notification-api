import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ChannelRegistry } from './channel-handler/channel.registry';
import { EmailChannel } from './channel-handler/email.channel';
import { SmsChannel } from './channel-handler/sms.channel';
import { WhatsAppChannel } from './channel-handler/whatsapp.channel';

@Global()
@Module({
  providers: [NotificationService, ChannelRegistry, EmailChannel, SmsChannel, WhatsAppChannel],
  exports: [NotificationService],
})
export class ServiceModule {}
