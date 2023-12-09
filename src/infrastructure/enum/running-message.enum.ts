export enum RunningMessageEnum {
  INVALID_METHOD = 'Method not supported',
  FINISH = 'Finish a autopay bu id %id',
  START = 'Start a autopay bu id %id',
  NOT_EXIST_AUTOPAY = 'Autopay not exist in period: %period and date: %date',
  INITIAL_JOBS = 'Initial %period jobs cron started',
  PROCESSOR_BUSY = 'Processor is busy',
  INVALID_STEP_TYPE = 'Invalid step type',
}
