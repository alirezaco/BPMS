import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAutopayActivityCommand } from './create-autopay-activity.command';
import { AutoPayActivityFactory } from 'domain/services';
import { AutoPayActivityEntity } from 'domain/models';

@CommandHandler(CreateAutopayActivityCommand)
export class CreateAutopayActivityHandler
  implements ICommandHandler<CreateAutopayActivityCommand>
{
  constructor(
    private readonly autopayActivityFactory: AutoPayActivityFactory,
  ) {}

  async execute(
    event: CreateAutopayActivityCommand,
  ): Promise<AutoPayActivityEntity> {
    return this.autopayActivityFactory.create(event.autopayActivityEntity);
  }
}
