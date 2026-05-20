import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ChannelRegistry } from './channel-handler/channel.registry';
import { EmailChannel } from './channel-handler/email.channel';

@Global()
@Module({
  providers: [NotificationService, ChannelRegistry, EmailChannel],
  exports: [NotificationService],
})
export class ServiceModule {}
