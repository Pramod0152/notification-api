import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  exports: [],
})
export class NotificationModule {}
