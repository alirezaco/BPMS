import { AutoPayActivityEntity } from 'domain/models';

export class CreateAutopayActivityCommand {
  constructor(public autopayActivityEntity: AutoPayActivityEntity) {}
}
