import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from 'src/bll/notification.service';
import { SendEmailDto } from '../../dto/email/send-email.dto';
import { ResponseHandlerService } from 'src/app/common/response/response-handler.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Post('email')
  async sendEmail(@Body() dto: SendEmailDto) {
    const result = await this.notificationService.sendEmail(dto);
    return this.responseHandler.HandleResponse(result);
  }
}
