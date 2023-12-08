import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AutoPayEntity, ProcessEntity } from 'domain/models';
import { EVENT_NAME } from 'infrastructure/constants';
import { ProcessingStatusEnum, RunningMessageEnum } from 'infrastructure/enum';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AutopayQueueQuery, GetProcessQuery } from '../queries';
import {
  UpdateAutopayLastRunCommand,
  UpdateAutopayStatusCommand,
} from '../commands';
import { RunAutopayStandalone } from './run-autopay.standalone';

@Injectable()
export class ProcessStandalones implements OnApplicationBootstrap {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectPinoLogger(ProcessStandalones.name)
    private readonly logger: PinoLogger,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly runAutopayStandlone: RunAutopayStandalone,
  ) {}

  onApplicationBootstrap() {
    this.run().then().catch();
  }

  private async getAutoPay(): Promise<AutoPayEntity> {
    const autoPay = await this.queryBus.execute<
      AutopayQueueQuery,
      AutoPayEntity
    >(new AutopayQueueQuery());

    return autoPay;
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

  private raiseEvent(time: number = 500) {
    setTimeout(() => {
      this.eventEmitter.emit(EVENT_NAME);
    }, time);
  }

  @OnEvent(EVENT_NAME)
  async run() {
    const autopay = await this.getAutoPay();

    //check exist autopay
    if (!autopay) {
      this.logger.info(RunningMessageEnum.NOT_EXIST_AUTOPAY);
      this.raiseEvent(1000 * 60 * 30);
      return;
    }

    //start autopay
    this.logger.info(RunningMessageEnum.START.replace('%id', autopay.id));
    await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.IN_PROGRESS);
    const process = await this.getProcess(autopay.id);
    const res = await this.runAutopayStandlone.run(autopay, process);

    //update autopay status
    if (res) {
      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.COMPLETED);
    } else {
      await this.updateAutoPayStatus(autopay, ProcessingStatusEnum.FAILED);
    }

    //update autopay last run
    await this.updateAutoPayLastRunAt(autopay);

    //raise event for next autopay
    this.raiseEvent();

    this.logger.info(RunningMessageEnum.FINISH.replace('%id', autopay.id));
  }
}
