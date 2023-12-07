import { ListAutopayRequest } from 'infrastructure/interfaces';

export class GetAutopaysQuery {
  constructor(public request: ListAutopayRequest, public userId: string) {}
}
