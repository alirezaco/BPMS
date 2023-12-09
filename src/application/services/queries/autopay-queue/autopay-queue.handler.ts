import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AutopayQueueQuery } from './autopay-queue.query';
import { AutoPayEntity } from 'domain/models';
import { AutoPayRepository } from 'domain/services';
import { PeriodEnum } from 'infrastructure/enum';
import { AutoPayQueue } from 'infrastructure/interfaces';

@QueryHandler(AutopayQueueQuery)
export class AutopayQueueHandler implements IQueryHandler<AutopayQueueQuery> {
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async getFromHourlyQueue(): Promise<AutoPayEntity[]> {
    const data = await this.autopayRepository.getHourlyQueue();

    return data;
  }

  async getFromDailyQueue(): Promise<AutoPayEntity[]> {
    const data = await this.autopayRepository.getDailyQueue();

    return data;
  }

  async getFromWeeklyQueue(): Promise<AutoPayEntity[]> {
    const data = await this.autopayRepository.getWeeklyQueue();

    return data;
  }

  async getFromMonthlyQueue(): Promise<AutoPayEntity[]> {
    const data = await this.autopayRepository.getMonthlyQueue();

    return data;
  }

  async getFromYearlyQueue(): Promise<AutoPayEntity[]> {
    const data = await this.autopayRepository.getYearlyQueue();

    return data;
  }

  private async getAutopayFromQueue(
    period: PeriodEnum,
  ): Promise<AutoPayEntity[]> {
    switch (period) {
      case PeriodEnum.HOUR:
        return this.getFromHourlyQueue();
      case PeriodEnum.DAY:
        return this.getFromDailyQueue();
      case PeriodEnum.WEEK:
        return this.getFromWeeklyQueue();
      case PeriodEnum.MONTH:
        return this.getFromMonthlyQueue();
      case PeriodEnum.YEAR:
        return this.getFromYearlyQueue();
    }
  }

  async execute({
    period,
  }: AutopayQueueQuery): Promise<AutoPayQueue<AutoPayEntity>> {
    const autopay = await this.getAutopayFromQueue(period);
    return { type: period, autopay };
  }
}
