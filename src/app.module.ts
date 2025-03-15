import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { commonConfigObj } from './common/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [commonConfigObj],
    }),
  ],
})
export class AppModule {}
