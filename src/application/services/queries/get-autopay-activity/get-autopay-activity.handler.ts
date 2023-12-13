import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetAutopayActivityQuery } from './get-autopay-activity.query';
import { AutoPayActivityRepository } from 'domain/services';
import { AutoPayActivityEntity } from 'domain/models';
import { MessageEnum } from 'infrastructure/enum';

@QueryHandler(GetAutopayActivityQuery)
export class GetAutopayActivityHandler
  implements IQueryHandler<GetAutopayActivityQuery>
{
  constructor(
    private readonly autopayActivityRepository: AutoPayActivityRepository,
  ) {}

  async execute(
    query: GetAutopayActivityQuery,
  ): Promise<AutoPayActivityEntity> {
    const { id } = query;

    const autopayActivity = await this.autopayActivityRepository.findOneById(
      id,
    );

    if (!autopayActivity) {
      throw new NotFoundException(MessageEnum.ACTIVITY_NOT_FOUND);
    }

    return autopayActivity;
  }
}
