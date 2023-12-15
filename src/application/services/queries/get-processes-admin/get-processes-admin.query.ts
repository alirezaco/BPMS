import { ListProcessesAdminRequest } from 'infrastructure/interfaces';

export class GetProcessesAdminQuery {
  constructor(public request: ListProcessesAdminRequest) {}
}
