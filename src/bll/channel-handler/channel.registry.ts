import { NotificationChannel } from 'src/lib/enum';
import { EmailChannel } from './email.channel';
import { Injectable } from '@nestjs/common';
import { INotificationChannel } from '../interfaces/notification-channel.interface';

@Injectable()
export class ChannelRegistry {
  private readonly channels = new Map<NotificationChannel, INotificationChannel>();

  constructor(private readonly emailChannel: EmailChannel) {
    this.channels.set(NotificationChannel.EMAIL, this.emailChannel);
  }

  resolve(channel: NotificationChannel): INotificationChannel {
    const handler = this.channels.get(channel);
    if (!handler) {
      throw new Error(`No handler registered for channel: ${channel}`);
    }
    return handler;
  }
}
