import * as dayjs from 'dayjs';
import { Types } from 'mongoose';

import { Token } from '../schemas';
import { DecodedJwt } from '../types';
import { User } from '@/users/schemas';

export class MockTokenBuilder {
  private token: Token;

  constructor(user: User) {
    // Set default values for builder
    this.token = {
      _id: new Types.ObjectId('81927555e99b62c9b1984300'),
      userId: user._id,
      isActive: true,
      expiredAt: dayjs().add(1, 'year').toDate(),
    };
  }

  public static getDecodedJwt(t: Token): DecodedJwt {
    return {
      tokenId: t._id.toString(),
    };
  }

  public build(): Token {
    return this.token;
  }

  public makeValid(): MockTokenBuilder {
    this.token.isActive = true;
    this.token.expiredAt = dayjs().add(1, 'year').toDate();
    return this;
  }

  public makeInactive(): MockTokenBuilder {
    this.token.isActive = false;
    this.token.expiredAt = dayjs().add(1, 'year').toDate();
    return this;
  }

  public makeExpired(): MockTokenBuilder {
    this.token.isActive = true;
    this.token.expiredAt = dayjs().subtract(1, 'year').toDate();
    return this;
  }
}
