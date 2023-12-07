import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAutopayActivitiesQuery } from './get-autopay-activities.query';
import { AutoPayActivityRepository } from 'domain/services';
import { findAndCountAll } from 'infrastructure/database';
import { AutoPayActivityEntity } from 'domain/models';

@QueryHandler(GetAutopayActivitiesQuery)
export class GetAutopayActivitiesHandler
  implements IQueryHandler<GetAutopayActivitiesQuery>
{
  constructor(
    private readonly autopayActivityRepository: AutoPayActivityRepository,
  ) {}

  async execute(
    query: GetAutopayActivitiesQuery,
  ): Promise<findAndCountAll<AutoPayActivityEntity>> {
    const { request } = query;

    // Retrieve the autopay activities from the repository
    const autopayActivities = await this.autopayActivityRepository.findAllAdmin(
      request,
    );

    return autopayActivities;
  }
}
