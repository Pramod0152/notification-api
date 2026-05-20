import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { NotificationChannel } from 'src/lib/enum';

export class SendNotificationDto {
  @ApiProperty({ example: NotificationChannel.EMAIL, enum: NotificationChannel })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Recipient: email address, E.164 phone (+977...), or WhatsApp number',
  })
  to: string;

  @ApiPropertyOptional({ example: 'Welcome' })
  subject?: string;

  @ApiPropertyOptional({
    example: '<p>Hello, welcome to our service.</p>',
    description: 'HTML body. Required when templateId is not provided.',
  })
  body?: string;

  @ApiPropertyOptional({
    description: 'SendGrid dynamic template ID from your SendGrid dashboard',
  })
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({
    example: { title: 'Title of your notification', message: 'Message of your notification' },
    description: 'Dynamic template substitution data (SendGrid or WhatsApp content variables)',
  })
  @IsOptional()
  templateData?: any;

  @ApiPropertyOptional({
    description: 'Twilio WhatsApp content template SID (use instead of body for approved templates)',
  })
  @IsOptional()
  contentSid?: string;
}
