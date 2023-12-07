import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CreateAutopayActivityEvent } from './create-autopay-activity.event';
import { AutoPayActivityFactory } from 'domain/services';

@EventsHandler(CreateAutopayActivityEvent)
export class AutopayActivityEventHandler
  implements IEventHandler<CreateAutopayActivityEvent>
{
  constructor(
    private readonly autopayActivityFactory: AutoPayActivityFactory,
  ) {}

  async handle(event: CreateAutopayActivityEvent) {
    await this.autopayActivityFactory.create(event.autopayActivityEntity);
  }
}
