import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { authConfigObj, CommonConfig, commonConfigObj } from './common/config';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfigObj, authConfigObj],
    }),
    MongooseModule.forRootAsync({
      useFactory: ({ dbUri }: CommonConfig) => ({ uri: dbUri }),
      inject: [commonConfigObj.KEY],
    }),
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      // Enable global validation of requests
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    },
    {
      // Enable global response serialization
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
