import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import * as seeds from '../seeds';
import { Model } from 'mongoose';

export const loadDbUtil = async (app: INestApplication) => {
  for (const index in seeds) {
    const seed = seeds[index];

    const model = app.get<Model<any>>(getModelToken(seed.collection));
    await model.insertMany(seed.data);
  }
};
