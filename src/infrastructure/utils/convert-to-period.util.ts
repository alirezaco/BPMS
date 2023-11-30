import { BadRequestException } from '@nestjs/common';
import { MessageEnum, PeriodEnum } from 'infrastructure/enum';

export const convertToPeriod = (period: string): PeriodEnum => {
  switch (period) {
    case PeriodEnum.CRON:
      return PeriodEnum.CRON;
    case PeriodEnum.DAY:
      return PeriodEnum.DAY;
    case PeriodEnum.HOUR:
      return PeriodEnum.HOUR;
    case PeriodEnum.MONTH:
      return PeriodEnum.MONTH;
    case PeriodEnum.WEEK:
      return PeriodEnum.WEEK;
    case PeriodEnum.YEAR:
      return PeriodEnum.YEAR;
    default:
      throw new BadRequestException(MessageEnum.INVALID_PERIOD);
  }
};
