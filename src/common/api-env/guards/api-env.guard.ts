import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CommonConfig, commonConfigObj } from '@/common/config';
import { CustomDecoratorKey } from '@/common/constants';

@Injectable()
export class ApiEnvGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

    @Inject(commonConfigObj.KEY) private readonly commonConfig: CommonConfig,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const envs = this.reflector.get<CommonConfig['nodeEnv'][] | undefined>(
      CustomDecoratorKey.API_ENV,
      ctx.getHandler(),
    );
    if (!envs) return true;
    if (!envs.includes(this.commonConfig.nodeEnv)) {
      // Make hidden routes transparent to the client
      throw new NotFoundException();
    }
    return true;
  }
}
