import { NotificationChannel } from 'src/lib/enum';
import { EmailChannel } from './email.channel';
import { SmsChannel } from './sms.channel';
import { WhatsAppChannel } from './whatsapp.channel';
import { Injectable } from '@nestjs/common';
import { INotificationChannel } from '../interfaces/notification-channel.interface';

@Injectable()
export class ChannelRegistry {
  private readonly channels = new Map<NotificationChannel, INotificationChannel>();

  constructor(
    private readonly emailChannel: EmailChannel,
    private readonly smsChannel: SmsChannel,
    private readonly whatsappChannel: WhatsAppChannel,
  ) {
    this.channels.set(NotificationChannel.EMAIL, this.emailChannel);
    this.channels.set(NotificationChannel.SMS, this.smsChannel);
    this.channels.set(NotificationChannel.WHATSAPP, this.whatsappChannel);
  }

  resolve(channel: NotificationChannel): INotificationChannel {
    const handler = this.channels.get(channel);
    if (!handler) {
      throw new Error(`No handler registered for channel: ${channel}`);
    }
    return handler;
  }
}
