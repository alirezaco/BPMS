import { HttpStatus, INestApplication } from '@nestjs/common';
import { dropDbUtil, initialApp, loadDbUtil } from './utils';
import { ProcessController } from 'presentation/controllers';
import { createProcessRequestMock } from './mocks';
import { Metadata } from '@grpc/grpc-js';
import { Types } from 'mongoose';

describe('ProcessController (e2e)', () => {
  let app: INestApplication;
  let processController: ProcessController;

  beforeAll(async () => {
    app = await initialApp();
    await loadDbUtil(app);
    processController = app.get<ProcessController>(ProcessController);
  });

  afterAll(async () => {
    await dropDbUtil(app);
  });

  it('create process', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await processController.createProcess(
      createProcessRequestMock,
      metadata,
    );
    console.log(response.meta.message);

    expect(response.meta?.status).toBe(HttpStatus.CREATED);

    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('roles');
    expect(response.data).toHaveProperty('allowed_direct_debit');
    expect(response.data).toHaveProperty('data');
    expect(response.data).toHaveProperty('steps');
    expect(response.data).toHaveProperty('ui_schema');
    expect(response.data).toHaveProperty('period');
    expect(response.data).toHaveProperty('max_amount');
    expect(response.data).toHaveProperty('created_at');
    expect(response.data).toHaveProperty('updated_at');
  });
});
