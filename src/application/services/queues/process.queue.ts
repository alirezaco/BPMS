import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AutoPayEntity, ProcessEntity } from 'domain/models';
import { ProcessingStatusEnum, RunningMessageEnum } from 'infrastructure/enum';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetAutopayQuery, GetProcessQuery } from '../queries';
import {
  UpdateAutopayLastRunCommand,
  UpdateAutopayStatusCommand,
} from '../commands';
import { RunAutopayProcessor } from '../processors';
import { Process, Processor } from '@nestjs/bull';
import { JOBS_QUEUE, JOB_PROCESS } from 'infrastructure/constants';
import { Job } from 'bull';

@Processor(JOBS_QUEUE)
export class ProcessQueue {
  constructor(
    @InjectPinoLogger(ProcessQueue.name)
    private readonly logger: PinoLogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly runAutopayProcessor: RunAutopayProcessor,
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

  @Process(JOB_PROCESS)
  async run(job: Job<{ autopayId: string }>) {
    const autopay = await this.getAutoPay(job.data.autopayId);

    //start autopay
    this.logger.info(RunningMessageEnum.START.replace('%id', autopay.id));
    await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.IN_PROGRESS);
    const process = await this.getProcess(autopay.id);
    const res = await this.runAutopayProcessor.run(autopay, process);

    //update autopay status
    if (res.success) {
      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.COMPLETED);
    } else {
      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.FAILED);
    }

    //update autopay last run
    await this.updateAutoPayLastRunAt(autopay);

    this.logger.info(RunningMessageEnum.FINISH.replace('%id', autopay.id));
  }
}
