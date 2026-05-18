import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  to: string;

  @ApiPropertyOptional({ example: 'Welcome' })
  subject?: string;

  @ApiPropertyOptional({
    example: '<p>Hello, welcome to our service.</p>',
    description: 'HTML body. Required when templateId is not provided.',
  })
  body?: string;

  @ApiPropertyOptional({
    example: 'd-7c3d8b2f8e9a4f1b2c3d4e5f6a7b8c9d',
    description:
      'SendGrid dynamic template ID from your SendGrid dashboard (not the Swagger placeholder)',
  })
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({
    example: { name: 'Jane', orderId: '12345' },
    description: 'Dynamic template substitution data',
  })
  @IsOptional()
  templateData?: any;
}
