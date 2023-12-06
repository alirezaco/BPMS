import { AutoPayRepository } from 'domain/services';
import { DeleteAutopayCommand } from './delete-autopay.command';
import { NotFoundException } from '@nestjs/common';
import { MessageEnum } from 'infrastructure/enum';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteAutopayCommand)
export class DeleteAutopayHandler
  implements ICommandHandler<DeleteAutopayCommand>
{
  constructor(private readonly autopayRepository: AutoPayRepository) {}

  async execute(command: DeleteAutopayCommand): Promise<void> {
    // Retrieve the Autopay entity from the repository
    const autopay = await this.autopayRepository.findOneById(command.id);

    if (autopay) {
      // Delete the Autopay
      await this.autopayRepository.deleteOne(autopay.id);
    } else {
      // Handle the case when the Autopay is not found
      throw new NotFoundException(MessageEnum.AUTOPAY_NOT_FOUND);
    }
  }
}
