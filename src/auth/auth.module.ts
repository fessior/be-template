import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { GoogleAuthController } from './controllers';
import { GoogleAuthService, TokenService } from './services';
import { AuthConfig, authConfigObj } from '@/common/config';
import { UserModule } from '@/users/user.module';

@Module({
  imports: [UserModule],
  controllers: [GoogleAuthController],
  providers: [
    JwtService,
    TokenService,
    GoogleAuthService,
    {
      provide: OAuth2Client,
      inject: [authConfigObj.KEY],
      useFactory: (authConfig: AuthConfig): OAuth2Client =>
        new OAuth2Client({
          clientId: authConfig.google.clientId,
          clientSecret: authConfig.google.clientSecret,
        }),
    },
  ],
})
export class AuthModule {}
