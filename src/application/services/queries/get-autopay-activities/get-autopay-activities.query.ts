import { ListAutopayActivityRequest } from 'infrastructure/interfaces';

export class GetAutopayActivitiesQuery {
  constructor(public request: ListAutopayActivityRequest) {}
}
