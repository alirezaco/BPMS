import { CreateProcessHandler } from './create-process';
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

export const commandHandlers = [
  CreateProcessHandler,
  UpdateProcessIsActiveHandler,
  UpdateProcessPeriodHandler,
  UpdateProcessRolesHandler,
  UpdateProcessStepsHandler,
  UpdateProcessAllowedDirectDebitHandler,
  UpdateProcessMaxAmountHandler,
  UpdateProcessNameHandler,
];
