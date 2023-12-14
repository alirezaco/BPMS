import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const dropDbUtil = async (app: INestApplication) => {
  const mongoConnection = app.get<Connection>(getConnectionToken());

  mongoConnection.dropDatabase();
};
