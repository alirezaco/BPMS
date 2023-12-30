import { HttpStatus, INestApplication } from '@nestjs/common';
import { dropDbUtil, initialApp, loadDbUtil } from './utils';
import { ProcessController } from 'presentation/controllers';
import { createProcessRequestMock, updateProcessRequestMock } from './mocks';
import { Metadata } from '@grpc/grpc-js';
import { Types } from 'mongoose';

describe('ProcessController (e2e)', () => {
  let app: INestApplication;
  let processController: ProcessController;

  beforeAll(async () => {
    process.env['MONGO_DB'] = 'autopay-process-test';
    app = await initialApp();
    await loadDbUtil(app);
    processController = app.get<ProcessController>(ProcessController);
  });

  afterAll(async () => {
    await dropDbUtil(app);
    await app.close();
  });

  it('create process', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await processController.createProcess(
      createProcessRequestMock,
      metadata,
    );

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

  it('update process', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await processController.updateProcess(
      updateProcessRequestMock,
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

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

    expect(response.data.name).toBe(updateProcessRequestMock.name);
    expect(response.data.roles).toBe(updateProcessRequestMock.roles);
    expect(response.data.allowed_direct_debit).toBe(
      updateProcessRequestMock.allowed_direct_debit,
    );
    expect(response.data.data).toBe(updateProcessRequestMock.data);
    expect(response.data.steps[0].type).toBe(
      updateProcessRequestMock.steps[0].type,
    );
    expect(response.data.ui_schema.length).toBe(
      updateProcessRequestMock.ui_schema.length,
    );
    expect(response.data.period).toBe(updateProcessRequestMock.period);
    expect(response.data.max_amount).toBe(updateProcessRequestMock.max_amount);
    expect(response.data.is_active).toBe(updateProcessRequestMock.is_active);
    expect(response.data.default_fail_step).toBe(
      updateProcessRequestMock.default_fail_step,
    );
  });

  it('get process', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await processController.getProcess(
      { id: updateProcessRequestMock.id },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

    expect(response.data).toHaveProperty('id');
  });

  it('delete process', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await processController.deleteProcess(
      { id: updateProcessRequestMock.id },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

    expect(response.data).toHaveProperty('id');
    expect(response.data.deleted_at).not.toEqual(null);
  });

  it('list processes', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());
    metadata.add('roles', 'user');

    const response = await processController.listProcesses(
      {
        limit: 5,
        skip: 0,
      },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

    expect(Array.isArray(response.data)).toBe(true);

    expect(response.data[0]).toHaveProperty('id');
    expect(response.data[0]).toHaveProperty('name');
    expect(response.data[0]).toHaveProperty('service_name');
    expect(response.data[0]).toHaveProperty('max_amount');
    expect(response.data[0]).toHaveProperty('period');
    expect(response.data[0]).toHaveProperty('min_amount');
    expect(response.data[0]).toHaveProperty('cron');
    expect(response.data[0]).toHaveProperty('cron_desc');
    expect(response.data[0]).toHaveProperty('allowed_direct_debit');
  });

  it('list processes admin', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await processController.listProcessesAdmin(
      {
        limit: 5,
        skip: 0,
        roles: [],
        is_active: true,
      },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.OK);

    expect(response.data).toHaveProperty('count');
    expect(response.data).toHaveProperty('rows');
  });

  it('create file', async () => {
    const metadata = new Metadata();
    metadata.add('me', new Types.ObjectId().toString());

    const response = await processController.createFile(
      {
        name: 'test',
        value: 'test1234',
      },
      metadata,
    );

    expect(response.meta?.status).toBe(HttpStatus.CREATED);

    expect(response.data).toHaveProperty('id');
  });
});
