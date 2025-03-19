/* eslint-disable @typescript-eslint/unbound-method */
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { Types } from 'mongoose';

import { GoogleAuthService } from './google-auth.service';
import { TokenService } from './token.service';
import { Token } from '../schemas';
import { authConfigObj } from '@/common/config';
import { MOCK_AUTH_CONFIG } from '@/common/config/mocks';
import { User } from '@/users/schemas';
import { UserService } from '@/users/services';

const MOCK_USER: User = {
  _id: new Types.ObjectId('81927555e99b62c9b1984301'),
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  googleId: '1234567890',
  avatarUrl: 'https://example.com/picture.jpg',
};

const MOCK_TOKEN: Token = {
  _id: new Types.ObjectId('81927555e99b62c9b1984300'),
  userId: new Types.ObjectId('81927555e99b62c9b1984301'),
  isActive: true,
  expiredAt: new Date('2022-03-01T00:00:00.000Z'),
};

describe('GoogleAuthService', () => {
  let userService: DeepMocked<UserService>;
  let tokenService: DeepMocked<TokenService>;
  let oauth2Client: DeepMocked<OAuth2Client>;
  let googleAuthService: GoogleAuthService;

  beforeEach(async () => {
    userService = createMock<UserService>();
    tokenService = createMock<TokenService>();
    oauth2Client = createMock<OAuth2Client>();
    const mod = await Test.createTestingModule({
      providers: [
        GoogleAuthService,
        {
          provide: authConfigObj.KEY,
          useValue: MOCK_AUTH_CONFIG,
        },
        { provide: UserService, useValue: userService },
        { provide: TokenService, useValue: tokenService },
        { provide: OAuth2Client, useValue: oauth2Client },
      ],
    }).compile();
    googleAuthService = mod.get(GoogleAuthService);
  });

  describe('Authenticate user, given idToken', () => {
    it('Should successfully authenticate user if the token is valid', async () => {
      const idToken = 'valid-id-token';
      const ticket = createMock<LoginTicket>();
      // TypeScript thinks we're using the version of `verifyIdToken` without
      // a return value, so we bypass this by casting to `never`.
      oauth2Client.verifyIdToken.mockResolvedValueOnce(<never>ticket);
      ticket.getPayload.mockReturnValueOnce({
        iss: 'accounts.google.com',
        aud: 'audience',
        iat: 1111111111,
        exp: 2222222222,
        family_name: MOCK_USER.lastName,
        given_name: MOCK_USER.firstName,
        email: MOCK_USER.email,
        picture: MOCK_USER.avatarUrl,
        sub: MOCK_USER.googleId,
      });
      userService.createOrUpdateUser.mockResolvedValueOnce({
        alreadyExists: false,
        user: MOCK_USER,
      });
      tokenService.create.mockResolvedValueOnce(MOCK_TOKEN);

      await googleAuthService.authenticate(idToken);
      expect(userService.createOrUpdateUser).toHaveBeenCalledTimes(1);
      expect(tokenService.create).toHaveBeenCalledTimes(1);
      expect(tokenService.signAccessToken).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error if the token is invalid', async () => {
      // TypeScript thinks we're using the version of `verifyIdToken` without
      // a return value, so we bypass this by casting to `never`.
      oauth2Client.verifyIdToken.mockRejectedValueOnce(
        <never>new Error('Invalid token'),
      );
      await expect(
        googleAuthService.authenticate('invalid-id-token'),
      ).rejects.toThrow();
    });
  });
});
