export interface INotificationChannel {
  send(logId: number, payload: Record<string, any>): Promise<void>;
}

export const NOTIFICATION_CHANNEL = 'NOTIFICATION_CHANNEL';
