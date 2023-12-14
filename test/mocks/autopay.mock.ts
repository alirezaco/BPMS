import {
  CreateAutopayRequest,
  UpdateAutopayRequest,
} from 'infrastructure/interfaces';
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

export const updateAutopayRequestMock: UpdateAutopayRequest = {
  id: '657b139ffc13ae0569fa211d',
  is_active: false,
  data: JSON.stringify({
    name: 'test2',
  }),
  max_amount: 5000,
  name: 'test2',
  allowed_direct_debit: false,
};
