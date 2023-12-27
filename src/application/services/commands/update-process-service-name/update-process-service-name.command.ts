import { ProcessEntity } from 'domain/models';

export class UpdateProcessServiceNameCommand {
  constructor(
    public processEntity: ProcessEntity,
    public serviceName: string,
  ) {}
}
