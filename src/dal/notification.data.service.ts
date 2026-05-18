import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NotificationLog } from './entities/notification.entity';
import { CreateNotificationLogInput, UpdateNotificationLogInput } from '../bll/interfaces/notification-log.interface';

@Injectable()
export class NotificationDataService {
  constructor(@InjectModel(NotificationLog) private model: typeof NotificationLog) {}

  createLog(data: CreateNotificationLogInput) {
    return this.model.create({
      channel: data.channel,
      provider: data.provider,
      status: data.status,
      payload: data.payload,
      attempts: data.attempts ?? 0,
      queuedAt: data.queuedAt,
    });
  }

  async updateLog(id: number, data: UpdateNotificationLogInput) {
    await this.model.update(
      {
        status: data.status,
        providerMsgId: data.providerMsgId,
        lastError: data.lastError,
        attempts: data.attempts,
      },
      { where: { id } },
    );
  }
}
