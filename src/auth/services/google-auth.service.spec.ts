/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test } from '@nestjs/testing';
import { OAuth2Client } from 'google-auth-library';
import { Types } from 'mongoose';

import { GoogleAuthService } from './google-auth.service';
import { TokenService } from './token.service';
import { AuthConfig, authConfigObj } from '@/common/config';
import { UserService } from '@/users/services';

const oauth2ClientMock = {
  verifyIdToken: jest.fn(),
};

jest.mock('@/auth/services/token.service');
jest.mock('@/users/services/user.service');

describe('GoogleAuthService', () => {
  let googleAuthService: GoogleAuthService;
  let userService: jest.Mocked<UserService>;
  let tokenService: jest.Mocked<TokenService>;
  let oauth2Client: jest.Mocked<OAuth2Client>;

  beforeAll(async () => {
    const authConfig: AuthConfig = {
      google: {
        clientId: 'test-client-id',
        clientSecret: 'test',
      },
      jwtSecret: 'test',
    };
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: OAuth2Client,
          useValue: oauth2ClientMock,
        },
        { provide: authConfigObj.KEY, useValue: authConfig },
        GoogleAuthService,
        UserService,
        TokenService,
      ],
    }).compile();

    googleAuthService = module.get(GoogleAuthService);
    userService = module.get(UserService);
    tokenService = module.get(TokenService);
    oauth2Client = module.get(OAuth2Client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should authenticate successfully if valid idToken is provided', async () => {
    const payload = {
      family_name: 'Doe',
      given_name: 'John',
      email: 'johndoe@gmail.com',
      picture: 'https://example.com/image.jpg',
      sub: '1234567890',
    };
    oauth2Client.verifyIdToken.mockResolvedValueOnce(<never>{
      getPayload: jest.fn().mockReturnValueOnce(payload),
    });
    userService.createOrUpdateUser.mockResolvedValueOnce({
      exists: false,
      user: <any>{
        _id: new Types.ObjectId('60f5a2c7b7e98a4d3c2f9e10'),
        email: payload.email,
        googleId: payload.sub,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatarUrl: payload.picture,
      },
    });
    tokenService.create.mockResolvedValueOnce(<any>{
      _id: new Types.ObjectId('60f5a7c9d4b3e81234a6f9b7'),
      isActive: true,
      expiredAt: new Date('2021-03-01T00:00:01Z'),
      userId: new Types.ObjectId('60f5a2c7b7e98a4d3c2f9e10'),
    });

    await googleAuthService.authenticate('valid-id-token');

    expect(userService.createOrUpdateUser).toHaveBeenCalledTimes(1);
    expect(tokenService.create).toHaveBeenCalledTimes(1);
    expect(tokenService.sign).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error if invalid idToken is provided', async () => {
    oauth2Client.verifyIdToken.mockRejectedValueOnce(<never>new Error());

    await expect(
      googleAuthService.authenticate('invalid-id-token'),
    ).rejects.toThrow();
  });
});
