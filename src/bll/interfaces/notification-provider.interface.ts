export interface SendResult {
  success: boolean;
  providerMsgId?: string;
  error?: string;
  statusCode?: number;
}

export interface NotificationPayload {
  to: string;
  subject?: string;
  body: string;
  templateId?: string;
  templateData?: any;
}
