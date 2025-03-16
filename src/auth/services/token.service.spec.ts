/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model, Types } from 'mongoose';

import { TokenService } from './token.service';
import { Token } from '../schemas';
import { AuthConfig, authConfigObj } from '@/common/config';
import { User } from '@/users/schemas';

const tokenModelMock = {
  create: jest.fn(),
  findById: jest.fn(),
};

describe('TokenService', () => {
  let tokenService: TokenService;
  let model: jest.Mocked<Model<Token>>;

  beforeEach(async () => {
    const authConfig: AuthConfig = {
      google: {
        clientId: 'my-client-id',
        clientSecret: 'my-client-secret',
      },
      jwtSecret: 'my-real-jwt-secret',
    };
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        TokenService,
        { provide: authConfigObj.KEY, useValue: authConfig },
        { provide: getModelToken(Token.name), useValue: tokenModelMock },
      ],
    }).compile();

    tokenService = module.get(TokenService);
    model = module.get(getModelToken(Token.name));
  });

  it('Should be able to sign and decode its own token', async () => {
    const tokenId = '65f5a2c7b7e98a4d3c2f9e10';
    const signed = await tokenService.sign(new Types.ObjectId(tokenId));
    const decoded = await tokenService.decode(signed);
    expect(decoded.tokenId).toBe(tokenId);
  });

  describe('Test token validation logic', () => {
    const now = new Date('2021-02-01T00:00:00Z');
    // Any date that is greater than `now`
    const future = new Date('2021-03-01T00:00:01Z');
    // Any date that is less than `now`
    const past = new Date('2021-01-01T00:00:00Z');
    beforeAll(() => {
      jest.useFakeTimers({ now });
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    test('Token exists and is still active', async () => {
      const tokenId = '65f5a2c7b7e98a4d3c2f9e10';
      const userId = '65f5a7c9d4b3e81234a6f9b7';
      const validToken = {
        _id: new Types.ObjectId(tokenId),
        userId: new Types.ObjectId(userId),
        isActive: true,
        expiredAt: future,
      };
      model.findById.mockResolvedValueOnce(validToken);

      const token = await tokenService.findAndValidateToken(validToken._id);
      expect(token).toEqual(validToken);
    });

    test('Token has been manually deactivated', async () => {
      const tokenId = '65f5a2c7b7e98a4d3c2f9e10';
      const userId = '65f5a7c9d4b3e81234a6f9b7';
      const invalidToken = {
        _id: new Types.ObjectId(tokenId),
        userId: new Types.ObjectId(userId),
        isActive: false,
        expiredAt: future,
      };
      model.findById.mockResolvedValueOnce(invalidToken);

      const token = await tokenService.findAndValidateToken(invalidToken._id);
      expect(token).toBeNull();
    });

    test('Token has expired', async () => {
      const tokenId = '65f5a2c7b7e98a4d3c2f9e10';
      const userId = '65f5a7c9d4b3e81234a6f9b7';
      const expiredToken = {
        _id: new Types.ObjectId(tokenId),
        userId: new Types.ObjectId(userId),
        isActive: true,
        expiredAt: past,
      };
      model.findById.mockResolvedValueOnce(expiredToken);

      const token = await tokenService.findAndValidateToken(expiredToken._id);
      expect(token).toBeNull();
    });

    test('Token does not exist', async () => {
      model.findById.mockResolvedValueOnce(null);
      const token = await tokenService.findAndValidateToken(
        new Types.ObjectId(),
      );
      expect(token).toBeNull();
    });
  });

  describe('Finding user by token', () => {
    it('Should return the user when token exists and matches a user', async () => {
      const mockToken: Omit<Token, 'userId'> & { userId: User } = {
        userId: {
          email: '123@gmail.com',
          googleId: '123',
          firstName: 'John',
          lastName: 'Doe',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        isActive: true,
        expiredAt: new Date('2022-01-01T00:00:00Z'),
      };
      model.findById.mockReturnValueOnce(<any>{
        populate: jest.fn().mockResolvedValueOnce(mockToken),
      });
      const user = await tokenService.findUserByToken(new Types.ObjectId());
      expect(user).toEqual(mockToken.userId);
    });

    it('Should throw 401 when token is not found', async () => {
      model.findById.mockReturnValueOnce(<any>{
        populate: jest.fn().mockResolvedValueOnce(null),
      });
      await expect(
        tokenService.findUserByToken(new Types.ObjectId()),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
