import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io';

import { WsAuthMiddleware } from './ws-auth.middleware';
import { TokenMockData } from '../mocks';
import { TokenService } from '../services';
import { UserMockData } from '@/users/mocks';

const MOCK_USER = UserMockData.getUser();

const MOCK_TOKEN = TokenMockData.getValidToken(MOCK_USER);
const MOCK_DECODED_JWT = TokenMockData.getDecodedJwt(MOCK_TOKEN);

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
    tokenService.decodeAccessToken.mockResolvedValueOnce(MOCK_DECODED_JWT);
    tokenService.findAndValidateToken.mockResolvedValueOnce(null);
    await wsAuth.authenticate(socket, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toBeUndefined();
  });

  test('Auth should succeed if given valid token', async () => {
    socket.handshake.headers.authorization = 'Bearer 123';
    tokenService.decodeAccessToken.mockResolvedValueOnce(MOCK_DECODED_JWT);
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
