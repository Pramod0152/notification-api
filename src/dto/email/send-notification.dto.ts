import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { NotificationChannel } from 'src/lib/enum';

export class SendNotificationDto {
  @ApiProperty({ example: NotificationChannel.EMAIL })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiProperty({ example: 'user@example.com' })
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
    description: 'Dynamic template substitution data',
  })
  @IsOptional()
  templateData?: any;
}
