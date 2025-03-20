import { Types } from 'mongoose';

import { Token } from '../schemas';
import { DecodedJwt } from '../types';
import { User } from '@/users/schemas';

export class TokenMock {
  /**
   * Timestamp to use for token validation
   * `getValidToken`, `getInactiveToken`, and `getExpiredToken`
   * bases their token expiration on this timestamp
   */
  public static readonly mockTimestamp: Date = new Date(
    '2022-02-01T00:00:00.000Z',
  );

  public static getValidToken(user: User): Token {
    return {
      _id: new Types.ObjectId('81927555e99b62c9b1984300'),
      userId: user._id,
      isActive: true,
      expiredAt: new Date('2022-03-01T00:00:00.000Z'),
    };
  }

  public static getInactiveToken(user: User): Token {
    return {
      _id: new Types.ObjectId('81927555e99b62c9b1984300'),
      userId: user._id,
      isActive: false,
      expiredAt: new Date('2022-03-01T00:00:00.000Z'),
    };
  }

  public static getExpiredToken(user: User): Token {
    return {
      _id: new Types.ObjectId('81927555e99b62c9b1984300'),
      userId: user._id,
      isActive: true,
      expiredAt: new Date('2022-01-01T00:00:00.000Z'),
    };
  }

  public static getDecodedJwt(token: Token): DecodedJwt {
    return {
      tokenId: token._id.toString(),
    };
  }
}
