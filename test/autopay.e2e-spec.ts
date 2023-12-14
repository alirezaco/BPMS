import { HttpStatus, INestApplication } from '@nestjs/common';
import { AutopayController } from 'presentation/controllers';
import { dropDbUtil, initialApp, loadDbUtil } from './utils';
import { Metadata } from '@grpc/grpc-js';
import { Types } from 'mongoose';
import { createAutopayRequestMock } from './mocks';

describe('AutopayController (e2e)', () => {
  let app: INestApplication;
  let autopayController: AutopayController;

  beforeAll(async () => {
    process.env['MONGO_DB'] = 'autopay-autopay-test';
    app = await initialApp();
    await loadDbUtil(app);
    autopayController = app.get<AutopayController>(AutopayController);
  });

  afterAll(async () => {
    await dropDbUtil(app);
  });

  it('create autopay', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await autopayController.createAutopay(
      createAutopayRequestMock,
      metadata,
    );

    console.log(response.meta.message);
    

    expect(response.meta?.status).toBe(HttpStatus.CREATED);

    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('process_id');
    expect(response.data).toHaveProperty('data');
    expect(response.data).toHaveProperty('created_at');
    expect(response.data).toHaveProperty('updated_at');
    expect(response.data).toHaveProperty('is_active');
    expect(response.data).toHaveProperty('owner');
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('user_id');
    expect(response.data).toHaveProperty('period');
    expect(response.data).toHaveProperty('last_run_at');
    expect(response.data).toHaveProperty('processing_status');
    expect(response.data).toHaveProperty('max_amount');
    expect(response.data).toHaveProperty('allowed_direct_debit');
    expect(response.data).toHaveProperty('ui_schema');
  });
});
