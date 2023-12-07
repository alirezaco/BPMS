import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAutopayActivitiesQuery } from 'application/services';
import { AutoPayActivityEntity } from 'domain/models';
import { findAndCountAll } from 'infrastructure/database';
import { ListAutopayActivityRequest } from 'infrastructure/interfaces';

@Injectable()
export class AutopayActivityUseCase {
  constructor(private readonly queryBus: QueryBus) {}

  async getAutopayActivity(
    request: ListAutopayActivityRequest,
  ): Promise<findAndCountAll<AutoPayActivityEntity>> {
    return this.queryBus.execute<
      GetAutopayActivitiesQuery,
      findAndCountAll<AutoPayActivityEntity>
    >(new GetAutopayActivitiesQuery(request));
  }
}
