import { ListProcessesRequest } from 'infrastructure/interfaces';

export class GetProcessesCommand {
  constructor(public request: ListProcessesRequest, public roles: string[]) {}
}
