import { AutoPayEntity } from 'domain/models';

export class CreateAutopayCommand {
  constructor(public autopayEntity: AutoPayEntity) {}
}
