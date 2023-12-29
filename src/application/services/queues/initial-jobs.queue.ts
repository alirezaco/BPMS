import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Queue } from 'bull';
import { AutoPayEntity } from 'domain/models';
import { JOBS_QUEUE, JOB_PROCESS } from 'infrastructure/constants';
import { PeriodEnum, RunningMessageEnum } from 'infrastructure/enum';
import { AutoPayQueue } from 'infrastructure/interfaces';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AutopayQueueQuery } from '../queries';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InitialJobsQueue implements OnApplicationBootstrap {
  constructor(
    @InjectPinoLogger(InitialJobsQueue.name)
    private readonly logger: PinoLogger,
    @InjectQueue(JOBS_QUEUE)
    private readonly jobsQueue: Queue,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (this.configService.get<string>('NODE_ENV') !== 'test') {
      await this.reinitialJobs();
    }
  }

  private async getAutoPay(
    period: PeriodEnum,
  ): Promise<AutoPayQueue<AutoPayEntity>> {
    const autoPay = await this.queryBus.execute<
      AutopayQueueQuery,
      AutoPayQueue<AutoPayEntity>
    >(new AutopayQueueQuery(period));

    return autoPay;
  }

  private async addNewJobToQueue(autopayId: string, priority: number) {
    await this.jobsQueue.add(
      JOB_PROCESS,
      {
        autopayId,
      },
      {
        jobId: autopayId,
        priority,
      },
    );
  }

  private async addNewJob(autopayQueue: AutoPayQueue<AutoPayEntity>) {
    const periodMapping = {
      [PeriodEnum.HOUR]: 1,
      [PeriodEnum.DAY]: 2,
      [PeriodEnum.WEEK]: 3,
      [PeriodEnum.MONTH]: 4,
      [PeriodEnum.YEAR]: 5,
    };

    const period = periodMapping[autopayQueue.type];

    for (const x of autopayQueue.autopay) {
      await this.addNewJobToQueue(x.id, period);
    }
  }

  private async initialJobs(period: PeriodEnum) {
    this.logger.info(
      RunningMessageEnum.INITIAL_JOBS.replace('%period', period),
    );

    const autoPays = await this.getAutoPay(period);

    if (!autoPays.autopay?.length) {
      this.logger.info(
        RunningMessageEnum.NOT_EXIST_AUTOPAY.replace('%period', period).replace(
          '%date',
          new Date().toISOString(),
        ),
      );
      return;
    }

    await this.addNewJob(autoPays);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async reinitialJobs() {
    await this.initialJobs(PeriodEnum.HOUR);
    await this.initialJobs(PeriodEnum.DAY);
    await this.initialJobs(PeriodEnum.WEEK);
    await this.initialJobs(PeriodEnum.MONTH);
    await this.initialJobs(PeriodEnum.YEAR);
  }
}
