import { CreateAutopayHandler } from './create-autopay';
import { CreateProcessHandler } from './create-process';
import { DeleteAutopayHandler } from './delete-autopay';
import { DeleteProcessHandler } from './delete-process';
import { UpdateAutoPayDataHandler } from './update-autopay-data';
import { UpdateAutopayDirectDebitHandler } from './update-autopay-direct-debit';
import { UpdateAutopayLastRunHandler } from './update-autopay-last-run';
import { UpdateAutoPayMaxAmountHandler } from './update-autopay-max-amount';
import { UpdateAutopayPeriodHandler } from './update-autopay-period';
import { UpdateAutopayStatusHandler } from './update-autopay-status';
import { UpdateProcessAllowedDirectDebitHandler } from './update-process-allow-direct-debit';
import { UpdateProcessIsActiveHandler } from './update-process-is-active';
import { UpdateProcessMaxAmountHandler } from './update-process-max-amount';
import { UpdateProcessNameHandler } from './update-process-name';
import { UpdateProcessPeriodHandler } from './update-process-period';
import { UpdateProcessRolesHandler } from './update-process-roles';
import { UpdateProcessStepsHandler } from './update-process-steps';

export * from './create-process';
export * from './update-process-allow-direct-debit';
export * from './update-process-is-active';
export * from './update-process-max-amount';
export * from './update-process-name';
export * from './update-process-period';
export * from './update-process-roles';
export * from './update-process-steps';
export * from './delete-process';
export * from './create-autopay';
export * from './update-autopay-max-amount';
export * from './update-autopay-direct-debit';
export * from './update-autopay-period';
export * from './update-autopay-data';
export * from './delete-autopay';
export * from './update-autopay-last-run';
export * from './update-autopay-status';

export const commandHandlers = [
  CreateProcessHandler,
  UpdateProcessIsActiveHandler,
  UpdateProcessPeriodHandler,
  UpdateProcessRolesHandler,
  UpdateProcessStepsHandler,
  UpdateProcessAllowedDirectDebitHandler,
  UpdateProcessMaxAmountHandler,
  UpdateProcessNameHandler,
  DeleteProcessHandler,
  CreateAutopayHandler,
  UpdateAutoPayMaxAmountHandler,
  UpdateAutopayDirectDebitHandler,
  UpdateAutopayPeriodHandler,
  UpdateAutoPayDataHandler,
  DeleteAutopayHandler,
  UpdateAutopayLastRunHandler,
  UpdateAutopayStatusHandler,
];
