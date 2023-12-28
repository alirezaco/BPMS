import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  AutoPayActivityEntity,
  AutoPayEntity,
  ProcessEntity,
} from 'domain/models';
import {
  FailedDelayEnum,
  ProcessingStatusEnum,
  RunningMessageEnum,
} from 'infrastructure/enum';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import {
  GetAutopayActivityQuery,
  GetAutopayQuery,
  GetProcessQuery,
} from '../queries';
import {
  UpdateAutopayLastRunCommand,
  UpdateAutopayStatusCommand,
} from '../commands';
import { RunAutopayProcessor } from '../processors';
import {
  InjectQueue,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import {
  FAILED_QUEUE,
  JOBS_QUEUE,
  JOB_FAILED_PROCESS,
  JOB_PROCESS,
} from 'infrastructure/constants';
import { Job, Queue } from 'bull';
import {
  FailedJobPayloadInterface,
  JobPayloadInterface,
} from 'infrastructure/interfaces';
import { InitialJobsQueue } from './initial-jobs.queue';
import { ConfigService } from '@nestjs/config';

@Processor(JOBS_QUEUE)
export class ProcessQueue {
  constructor(
    @InjectPinoLogger(ProcessQueue.name)
    private readonly logger: PinoLogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly runAutopayProcessor: RunAutopayProcessor,
    @InjectQueue(FAILED_QUEUE)
    private readonly failedQueue: Queue,
    @InjectQueue(JOBS_QUEUE)
    private readonly jobsQueue: Queue,
    private readonly initialJobsCron: InitialJobsQueue,
    private readonly configService: ConfigService,
  ) {}

  private async getAutoPay(id: string): Promise<AutoPayEntity> {
    const autopay = await this.queryBus.execute<GetAutopayQuery, AutoPayEntity>(
      new GetAutopayQuery(id),
    );

    return autopay;
  }

  private async getProcess(id: string): Promise<ProcessEntity> {
    const process = await this.queryBus.execute<GetProcessQuery, ProcessEntity>(
      new GetProcessQuery(id),
    );

    return process;
  }

  private async updateAutoPayStatus(
    autopay: AutoPayEntity,
    status: ProcessingStatusEnum,
  ) {
    await this.commandBus.execute<UpdateAutopayStatusCommand>(
      new UpdateAutopayStatusCommand(autopay, status),
    );
  }

  private async updateAutoPayLastRunAt(autopay: AutoPayEntity) {
    await this.commandBus.execute<UpdateAutopayLastRunCommand>(
      new UpdateAutopayLastRunCommand(autopay, new Date()),
    );
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
      default:
        return FailedDelayEnum.FIVE_MIN;
    }
  }

  private async addToFailedQueue(
    autopayId: string,
    activityId: string,
    delay: number,
  ) {
    const data: FailedJobPayloadInterface = {
      activityId,
      autopayId,
    };

    await this.failedQueue.add(JOB_FAILED_PROCESS, data, {
      delay: this.getDeley(delay, autopayId),
    });
  }

  private async getActivity(id: string): Promise<AutoPayActivityEntity> {
    return await this.queryBus.execute<
      GetAutopayActivityQuery,
      AutoPayActivityEntity
    >(new GetAutopayActivityQuery(id));
  }

  @Process(JOB_PROCESS)
  async execute(job: Job<JobPayloadInterface>) {
    const autopay = await this.getAutoPay(job.data.autopayId);
    let activity: AutoPayActivityEntity = undefined;

    if (job.data.isFailed) {
      activity = await this.getActivity(job.data.activityId);
    }

    //start autopay
    this.logger.info(RunningMessageEnum.START.replace('%id', autopay.id));
    await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.IN_PROGRESS);
    const process = await this.getProcess(autopay.processId);
    const res = await this.runAutopayProcessor.run(autopay, process, activity);

    //update autopay status
    if (res.success) {
      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.COMPLETED);
    } else {
      if (res.isRetry) {
        await this.addToFailedQueue(autopay.id, res.activityId, job.data.delay);
      }

      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.FAILED);
    }

    //update autopay last run
    await this.updateAutoPayLastRunAt(autopay);

    this.logger.info(RunningMessageEnum.FINISH.replace('%id', autopay.id));
  }

  @OnQueueCompleted()
  async onQueueCompleted() {
    if (this.configService.get<string>('NODE_ENV') === 'test') {
      return;
    }

    const count = await this.jobsQueue.count();

    if (count <= 3) {
      await this.initialJobsCron.reinitialJobs();
    }
  }
}
