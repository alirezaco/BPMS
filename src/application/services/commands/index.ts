import { CreateAutopayHandler } from './create-autopay';
import { CreateAutopayActivityHandler } from './create-autopay-activity';
import { CreateFileHandler } from './create-file';
import { CreateProcessHandler } from './create-process';
import { DeleteAutopayHandler } from './delete-autopay';
import { DeleteProcessHandler } from './delete-process';
import { UpdateAutoPayDataHandler } from './update-autopay-data';
import { UpdateAutopayDirectDebitHandler } from './update-autopay-direct-debit';
import { UpdateAutopayIsActiveHandler } from './update-autopay-is-active';
import { UpdateAutopayLastRunHandler } from './update-autopay-last-run';
import { UpdateAutoPayMaxAmountHandler } from './update-autopay-max-amount';
import { UpdateAutopayMetadataHandler } from './update-autopay-metadata';
import { UpdateAutoPayMinAmountHandler } from './update-autopay-min-amount';
import { UpdateAutoPayNameHandler } from './update-autopay-name';
import { UpdateAutopayPeriodHandler } from './update-autopay-period';
import { UpdateAutopayStatusHandler } from './update-autopay-status';
import { UpdateProcessAllowedDirectDebitHandler } from './update-process-allow-direct-debit';
import { UpdateProcessIsActiveHandler } from './update-process-is-active';
import { UpdateProcessMaxAmountHandler } from './update-process-max-amount';
import { UpdateProcessMinAmountHandler } from './update-process-min-amount';
import { UpdateProcessNameHandler } from './update-process-name';
import { UpdateProcessPeriodHandler } from './update-process-period';
import { UpdateProcessRolesHandler } from './update-process-roles';
import { UpdateProcessServiceNameHandler } from './update-process-service-name';
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
export * from './update-autopay-name';
export * from './create-file';
export * from './update-autopay-is-active';
export * from './create-autopay-activity';
export * from './update-autopay-metadata';
export * from './update-autopay-min-amount';
export * from './update-process-min-amount';
export * from './update-process-service-name';

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
  UpdateAutoPayNameHandler,
  CreateFileHandler,
  UpdateAutopayIsActiveHandler,
  CreateAutopayActivityHandler,
  UpdateAutopayMetadataHandler,
  UpdateAutoPayMinAmountHandler,
  UpdateProcessMinAmountHandler,
  UpdateProcessServiceNameHandler,
];
