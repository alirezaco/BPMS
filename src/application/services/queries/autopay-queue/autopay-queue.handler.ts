import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AutopayQueueQuery } from './autopay-queue.query';
import { AutoPayEntity } from 'domain/models';
import { AutoPayRepository } from 'domain/services';

@QueryHandler(AutopayQueueQuery)
export class AutopayQueueHandler implements IQueryHandler<AutopayQueueQuery> {
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async getFromHourlyQueue(): Promise<AutoPayEntity> {
    const data = await this.autopayRepository.getHourlyQueue();

    return data[0];
  }

  async getFromDailyQueue(): Promise<AutoPayEntity> {
    const data = await this.autopayRepository.getDailyQueue();

    return data[0];
  }

  async getFromWeeklyQueue(): Promise<AutoPayEntity> {
    const data = await this.autopayRepository.getWeeklyQueue();

    return data[0];
  }

  async getFromMonthlyQueue(): Promise<AutoPayEntity> {
    const data = await this.autopayRepository.getMonthlyQueue();

    return data[0];
  }

  async getFromYearlyQueue(): Promise<AutoPayEntity> {
    const data = await this.autopayRepository.getYearlyQueue();

    return data[0];
  }

  async execute(_: AutopayQueueQuery): Promise<AutoPayEntity> {
    const hourlyAutopay = await this.getFromHourlyQueue();

    if (hourlyAutopay) {
      return hourlyAutopay;
    }

    const dailyAutopay = await this.getFromDailyQueue();

    if (dailyAutopay) {
      return dailyAutopay;
    }

    const weeklyAutopay = await this.getFromWeeklyQueue();

    if (weeklyAutopay) {
      return weeklyAutopay;
    }

    const monthlyAutopay = await this.getFromMonthlyQueue();

    if (monthlyAutopay) {
      return monthlyAutopay;
    }

    const yearlyAutopay = await this.getFromYearlyQueue();

    if (yearlyAutopay) {
      return yearlyAutopay;
    }
  }
}
