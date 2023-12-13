import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import {
  FAILED_QUEUE,
  JOBS_QUEUE,
  JOB_FAILED_PROCESS,
} from 'infrastructure/constants';
import { FailedDelayEnum, RunningMessageEnum } from 'infrastructure/enum';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ProcessQueue } from './process.queue';
import {
  FailedJobPayloadInterface,
  JobPayloadInterface,
} from 'infrastructure/interfaces';

@Processor(FAILED_QUEUE)
export class FailedQueue {
  constructor(
    @InjectPinoLogger(FailedQueue.name)
    private readonly logger: PinoLogger,
    @InjectQueue(JOBS_QUEUE)
    private readonly jobsQueue: Queue,
    @InjectQueue(FAILED_QUEUE)
    private readonly failedQueue: Queue,
    private readonly processQueue: ProcessQueue,
  ) {}

  async checkJobsQueueLength(): Promise<boolean> {
    const count = await this.jobsQueue.count();

    if (count > 0) {
      return false;
    }

    return true;
  }

  async addJobsQueue(data: JobPayloadInterface) {
    const job: Job<JobPayloadInterface> = {
      data,
    } as any;

    await this.processQueue.execute(job);
  }

  getDeley(delay: FailedDelayEnum, autopayId: string): number {
    switch (delay) {
      case FailedDelayEnum.THIRTY_MIN:
        return FailedDelayEnum.FIFTEEN_MIN;
      case FailedDelayEnum.ONE_HOUR:
        return FailedDelayEnum.TWO_HOUR;
      case FailedDelayEnum.FIVE_MIN:
        return FailedDelayEnum.TEN_MIN;
      case FailedDelayEnum.TEN_MIN:
        return FailedDelayEnum.THIRTY_MIN;
      case FailedDelayEnum.FIFTEEN_MIN:
        return FailedDelayEnum.ONE_HOUR;
      case FailedDelayEnum.TWO_HOUR:
        throw new Error(
          RunningMessageEnum.MAX_DELAY_REACHED.replace('%id', autopayId),
        );
    }
  }

  async addFailedQueue(autopayId: string, delay: number, activityId: string) {
    const data: FailedJobPayloadInterface = {
      activityId,
      autopayId,
    };
    await this.failedQueue.add(JOB_FAILED_PROCESS, data, {
      delay,
    });
  }

  @Process(JOB_FAILED_PROCESS)
  async execute(job: Job<FailedJobPayloadInterface>) {
    this.logger.info(
      RunningMessageEnum.START_FAILED.replace('%id', job.data.autopayId),
    );

    const jobsQueueStatus = await this.checkJobsQueueLength();

    if (jobsQueueStatus) {
      await this.addJobsQueue({
        autopayId: job.data.autopayId,
        isFailed: true,
        activityId: job.data.activityId,
      });
    } else {
      await this.addFailedQueue(
        job.data.autopayId,
        FailedDelayEnum.NONE,
        job.data.activityId,
      );
    }
  }
}
