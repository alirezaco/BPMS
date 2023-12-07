import { AutoPayActivityEntity } from 'domain/models';

export class CreateAutopayActivityEvent {
  constructor(public autopayActivityEntity: AutoPayActivityEntity) {}
}
