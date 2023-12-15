export enum RunningMessageEnum {
  INVALID_METHOD = 'Method not supported',
  FINISH = 'Finish a autopay by id %id',
  START = 'Start a autopay by id %id',
  START_FAILED = 'Start process on autopay failed with id %id',
  NOT_EXIST_AUTOPAY = 'Autopay not exist in period: %period and date: %date',
  INITIAL_JOBS = 'Initial %period jobs cron started',
  PROCESSOR_BUSY = 'Processor is busy',
  INVALID_STEP_TYPE = 'Invalid step type',
  MAX_DELAY_REACHED = 'Max delay reached: %id',
  PAYMENT = 'start a payment by amount: %amount for autopay: %id',
}
