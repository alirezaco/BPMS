import { ProcessEntity, RepeatEntity } from 'domain/models';

export class UpdateProcessRepeatCommand {
  constructor(
    public readonly processEntity: ProcessEntity,
    public readonly isRepeatable: boolean,
    public readonly repeat: RepeatEntity,
  ) {}
}
