import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { NodeEnv } from '@/common/config';
import { CustomDecoratorKey } from '@/common/constants';

export const MatchEnv = (envs: NodeEnv[]): CustomDecorator =>
  SetMetadata(CustomDecoratorKey.API_ENV, envs);
