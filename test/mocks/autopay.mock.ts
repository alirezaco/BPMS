import { CreateAutopayRequest } from 'infrastructure/interfaces';
import { processIdMock } from './process.mock';

export const createAutopayRequestMock: CreateAutopayRequest = {
  data: JSON.stringify({
    name: 'test',
  }),
  max_amount: 10000,
  name: 'test',
  process_id: processIdMock,
  allowed_direct_debit: false,
};
