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
import { GetAutopayQuery, GetProcessQuery } from '../queries';
import {
  UpdateAutopayLastRunCommand,
  UpdateAutopayStatusCommand,
} from '../commands';
import { RunAutopayProcessor } from '../processors';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import {
  FAILED_QUEUE,
  JOBS_QUEUE,
  JOB_FAILED_PROCESS,
  JOB_PROCESS,
} from 'infrastructure/constants';
import { Job, Queue } from 'bull';
import { GetAutopayActivityQuery } from '../queries/get-autopay-activity/get-autopay-activity.query';
import {
  FailedJobPayloadInterface,
  JobPayloadInterface,
} from 'infrastructure/interfaces';

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

  private async addToFailedQueue(autopayId: string, activityId: string) {
    const data: FailedJobPayloadInterface = {
      activityId,
      autopayId,
    };

    await this.failedQueue.add(JOB_FAILED_PROCESS, data, {
      delay: FailedDelayEnum.FIVE_MIN,
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
    const process = await this.getProcess(autopay.id);
    const res = await this.runAutopayProcessor.run(autopay, process, activity);

    //update autopay status
    if (res.success) {
      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.COMPLETED);
    } else {
      if (res.isRetry) {
        await this.addToFailedQueue(autopay.id, res.activityId);
      }

      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.FAILED);
    }

    //update autopay last run
    await this.updateAutoPayLastRunAt(autopay);

    this.logger.info(RunningMessageEnum.FINISH.replace('%id', autopay.id));
  }
}