import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AutoPayActivitySerializer } from 'application/serializers';
import { GetAutopayActivitiesQuery } from 'application/services';
import { AutoPayActivityEntity } from 'domain/models';
import { UserProxy } from 'domain/services/proxies';
import { findAndCountAll } from 'infrastructure/database';
import { ListAutopayActivityRequest } from 'infrastructure/interfaces';

@Injectable()
export class AutopayActivityUseCase {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userProxy: UserProxy,
  ) {}

  async getAutopayActivity(
    request: ListAutopayActivityRequest,
  ): Promise<findAndCountAll<AutoPayActivitySerializer>> {
    const res = await this.queryBus.execute<
      GetAutopayActivitiesQuery,
      findAndCountAll<AutoPayActivityEntity>
    >(new GetAutopayActivitiesQuery(request));

    return {
      count: res.count,
      rows: await Promise.all(
        res.rows.map(async (x) => {
          const user = await this.userProxy.findMe(x?.autopay?.userId);
          x.setUser({
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            id: user.id,
          });
          return new AutoPayActivitySerializer(x);
        }),
      ),
    };
  }
}
