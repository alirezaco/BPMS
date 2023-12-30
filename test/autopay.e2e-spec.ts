import { HttpStatus, INestApplication } from '@nestjs/common';
import { AutopayController } from 'presentation/controllers';
import { dropDbUtil, initialApp, loadDbUtil } from './utils';
import { Metadata } from '@grpc/grpc-js';
import { Types } from 'mongoose';
import { createAutopayRequestMock, updateAutopayRequestMock } from './mocks';

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
    await app.close();
  });

  it('create autopay', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());
    metadata.add('roles', 'user');
    metadata.add('roles', 'employee');

    const response = await autopayController.createAutopay(
      createAutopayRequestMock,
      metadata,
    );

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

  it('update autopay', async () => {
    const metadata = new Metadata();
    metadata.add('me', '657b139ffc13ae0569fa2121');

    const response = await autopayController.updateAutopay(
      updateAutopayRequestMock,
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

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

    expect(response.data.name).toBe(updateAutopayRequestMock.name);
    expect(response.data.is_active).toBe(updateAutopayRequestMock.is_active);
    expect(response.data.allowed_direct_debit).toBe(
      updateAutopayRequestMock.allowed_direct_debit,
    );
    expect(response.data.max_amount).toBe(updateAutopayRequestMock.max_amount);
    expect(response.data.data).toBe(updateAutopayRequestMock.data);
  });

  it('get autopay', async () => {
    const metadata = new Metadata();
    metadata.add('me', '657b139ffc13ae0569fa2121');

    const response = await autopayController.getAutopay(
      {
        id: '657b139ffc13ae0569fa211d',
      },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

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

  it('list autopay', async () => {
    const metadata = new Metadata();
    metadata.add('me', '657b139ffc13ae0569fa2121');

    const response = await autopayController.listAutopays(
      {
        limit: 10,
        skip: 0,
      },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

    expect(response.data).toHaveProperty('count');
    expect(response.data).toHaveProperty('rows');

    expect(response.data.rows[0]).toHaveProperty('id');
    expect(response.data.rows[0]).toHaveProperty('name');
    expect(response.data.rows[0]).toHaveProperty('count');
    expect(response.data.rows[0]).toHaveProperty('values');

    const value = response.data.rows.find((x) => x.count !== 0)?.values[0];

    expect(value).toHaveProperty('id');
  });

  it('delete autopay', async () => {
    const metadata = new Metadata();
    metadata.add('me', '657b139ffc13ae0569fa2121');

    const response = await autopayController.deleteAutopay(
      {
        id: '657b139ffc13ae0569fa211d',
      },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

    expect(response.data).toHaveProperty('id');
  });

  it('list autopay admin', async () => {
    const metadata = new Metadata();
    metadata.add('me', '657b139ffc13ae0569fa2121');

    const response = await autopayController.listAutopaysAdmin(
      {
        limit: 10,
        skip: 0,
        allowed_direct_debit: false,
        is_active: true,
        status: 'pending',
      },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

    expect(response.data).toHaveProperty('count');
    expect(response.data).toHaveProperty('rows');
  });
});
