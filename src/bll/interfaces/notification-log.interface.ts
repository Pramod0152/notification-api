import { NotificationStatus } from 'src/lib/enum';

export interface CreateNotificationLogInput {
  channel: string;
  provider: string;
  status: NotificationStatus;
  payload: any;
  attempts?: number;
  queuedAt?: Date;
}

export interface UpdateNotificationLogInput {
  status?: NotificationStatus;
  providerMsgId?: string;
  lastError?: string;
  attempts?: number;
}
