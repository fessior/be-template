import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';

import { WsAuthMiddleware } from './ws-auth.middleware';
import { Token } from '../schemas';
import { TokenService } from '../services';
import { DecodedJwt } from '../types';
import { User } from '@/users/schemas';

const MOCK_TOKEN: Token = {
  _id: new Types.ObjectId('67da752e3a426b153739c130'),
  userId: new Types.ObjectId('67da753f3a426b153739c131'),
  isActive: true,
  expiredAt: new Date('2022-03-01T00:00:00.000Z'),
};

const MOCK_USER: User = {
  _id: new Types.ObjectId('67da753f3a426b153739c131'),
  email: 'johndoe@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  googleId: '1234567890',
  avatarUrl: 'https://example.com/avatar.jpg',
};

describe('WsAuthMiddleware', () => {
  let tokenService: DeepMocked<TokenService>;
  const next = jest.fn();
  let socket: DeepMocked<Socket>;
  let wsAuth: WsAuthMiddleware;

  beforeEach(async () => {
    tokenService = createMock<TokenService>();
    socket = createMock<Socket>();
    socket.user = undefined;
    const mod = await Test.createTestingModule({
      providers: [
        WsAuthMiddleware,
        {
          provide: TokenService,
          useValue: tokenService,
        },
      ],
    }).compile();
    wsAuth = mod.get(WsAuthMiddleware);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Auth should fail if no token is provided', async () => {
    socket.handshake.headers.authorization = '';
    await wsAuth.authenticate(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toBeUndefined();
  });

  test('Auth should fail if token is invalid', async () => {
    socket.handshake.headers.authorization = 'Bearer 123';
    tokenService.decodeAccessToken.mockResolvedValueOnce(<DecodedJwt>{
      tokenId: MOCK_TOKEN._id.toString(),
    });
    tokenService.findAndValidateToken.mockResolvedValueOnce(null);
    await wsAuth.authenticate(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toBeUndefined();
  });

  test('Auth should succeed if given valid token', async () => {
    socket.handshake.headers.authorization = 'Bearer 123';
    tokenService.decodeAccessToken.mockResolvedValueOnce(<DecodedJwt>{
      tokenId: MOCK_TOKEN._id.toString(),
    });
    tokenService.findAndValidateToken.mockResolvedValueOnce(MOCK_TOKEN);
    tokenService.findUserByToken.mockResolvedValueOnce(MOCK_USER);

    await wsAuth.authenticate(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toEqual({
      token: MOCK_TOKEN,
      profile: MOCK_USER,
    });
  });
});
