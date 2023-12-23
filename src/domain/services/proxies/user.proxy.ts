import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
  UserSchemaPayload,
  UserAutopay,
} from 'infrastructure/interfaces';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserProxy implements OnModuleInit {
  private UserService: UserServiceClient;

  constructor(
    @Inject(USER_PACKAGE_NAME) private client: ClientGrpc,
    @InjectPinoLogger(UserProxy.name)
    private readonly logger: PinoLogger,
  ) {}

  onModuleInit() {
    this.UserService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async checkExist(id: string): Promise<boolean> {
    const data = await lastValueFrom(this.UserService.findById({ id }));

    if (data.meta.status === 200 && data) return true;

    this.logger.debug(data.meta.message);

    return false;
  }

  async findOne(id: string): Promise<UserSchemaPayload> {
    const data = await lastValueFrom(this.UserService.findById({ id }));

    if (data.meta.status !== 200 || !data.data) {
      this.logger.debug(data.meta.message);

      return undefined;
    }

    return data.data;
  }

  async findMe(id: string): Promise<UserAutopay> {
    const data = await lastValueFrom(this.UserService.findMe({ id }));

    if (data.meta.status !== 200 || !data.data) {
      this.logger.debug(data.meta.message);
    }

    return {
      first_name: data.data?.profile?.first_name,
      last_name: data.data?.profile?.last_name,
      phone: data.data?.phone,
      id,
    };
  }
}
