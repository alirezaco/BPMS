import { ListProcessesAdminRequest } from 'infrastructure/interfaces';

export class GetProcessesAdminCommand {
  constructor(public request: ListProcessesAdminRequest) {}
}
