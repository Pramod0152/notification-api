import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from 'src/bll/notification.service';
import { SendNotificationDto } from '../../dto/email/send-notification.dto';
import { ResponseHandlerService } from 'src/app/common/response/response-handler.service';
import { PaginationDto } from 'src/dto/pagination.dto';

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

  @Get('')
  async getLogs(@Query() query: PaginationDto) {
    const logs = await this.notificationService.getLogs(query);
    return this.responseHandler.HandleResponse(logs);
  }

  @Get(':id')
  async getLog(@Param('id', ParseIntPipe) id: number) {
    const log = await this.notificationService.getLog(id);
    return this.responseHandler.HandleResponse(log);
  }
}
