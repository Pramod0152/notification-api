import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from 'src/bll/notification.service';
import { SendNotificationDto } from '../../dto/email/send-notification.dto';
import { ResponseHandlerService } from 'src/app/common/response/response-handler.service';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly responseHandler: ResponseHandlerService,
  ) {}

  @Post('')
  async sendNotification(@Body() item: SendNotificationDto) {
    const { message } = await this.notificationService.sendNotification(item);
    return this.responseHandler.HandleResponse(message);
  }
}
