import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

export interface SmsPayload {
  to: string;
  body: string;
}

export interface WhatsAppPayload {
  to: string;
  body?: string;
  contentSid?: string;
  templateData?: Record<string, string>;
}

@Injectable()
export class TwilioService {
  private readonly client: Twilio;

  constructor(private readonly configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>('TWILIO_ACCOUNT_SID'),
      this.configService.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSms(payload: SmsPayload) {
    try {
      const message = await this.client.messages.create({
        body: payload.body,
        from: this.configService.get<string>('TWILIO_SMS_FROM'),
        to: this.formatSmsTo(payload.to),
      });

      return {
        success: true,
        providerMsgId: message.sid,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  }

  async sendWhatsApp(payload: WhatsAppPayload) {
    try {
      const params: {
        from: string;
        to: string;
        body?: string;
        contentSid?: string;
        contentVariables?: string;
      } = {
        from: this.configService.get<string>('TWILIO_WHATSAPP_FROM'),
        to: this.formatWhatsAppTo(payload.to),
      };

      if (payload.contentSid) {
        params.contentSid = payload.contentSid;
        if (payload.templateData) {
          params.contentVariables = JSON.stringify(payload.templateData);
        }
      } else if (payload.body) {
        params.body = payload.body;
      } else {
        throw new Error('WhatsApp message requires body or contentSid');
      }

      const message = await this.client.messages.create(params);

      return {
        success: true,
        providerMsgId: message.sid,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  }

  private formatSmsTo(to: string): string {
    return to.startsWith('+') ? to : `+${to}`;
  }

  private formatWhatsAppTo(to: string): string {
    const normalized = this.formatSmsTo(to.replace(/^whatsapp:/i, ''));
    return to.startsWith('whatsapp:') ? to : `whatsapp:${normalized}`;
  }
}
