export enum EnvVariableType {
  PROD = 'prod',
  UAT = 'uat',
  QA = 'qa',
  DEV = 'dev',
  LOC = 'local',
}

export enum SuccessMessageType {
  DefaultSuccessMessage = 'Success',
}

export enum ThrottlerConfig {
  GlobalThrottleTtl = 60,
  GlobalThrottleLimit = 2000,
}

export enum SeverityType {
  emerg = 0,
  alert = 1,
  crit = 2,
  error = 3,
  warning = 4,
  notice = 5,
  info = 6,
  debug = 7,
}

export enum ErrorCodeType {
  GeneralException = 'GENERAL_EXCEPTION',
}

export enum AuthVariable {
  SaltOrRounds = 10,
}

export enum ErrorMessageType {
  GeneralException = 'Something went wrong. Please try again later.',
  DefaultErrorMessage = 'Internal Server Error',
}

export enum NotificationChannel {
  EMAIL = 'email',
}

export enum NotificationProviderType {
  SENDGRID = 'sendgrid',
}

export enum NotificationStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
  READ = 'read',
}

export enum BullQueueName {
  EMAIL = 'email-queue',
}
