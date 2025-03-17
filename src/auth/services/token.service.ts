import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Token, TokenDocument } from '../schemas';
import { DecodedJwt } from '../types';
import { AuthConfig, authConfigObj } from '@/common/config';
import { User, UserDocument } from '@/users/schemas';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(authConfigObj.KEY) private readonly authConfig: AuthConfig,
  ) {}

  public async sign(token: TokenDocument): Promise<string> {
    const jwt: DecodedJwt = {
      tokenId: token._id.toString(),
    };
    return this.jwtService.signAsync(jwt, {
      secret: this.authConfig.jwtSecret,
    });
  }

  public async decode(token: string): Promise<DecodedJwt> {
    return this.jwtService.verifyAsync<DecodedJwt>(token, {
      secret: this.authConfig.jwtSecret,
    });
  }

  public async create(userId: Types.ObjectId): Promise<TokenDocument> {
    return this.tokenModel.create({ userId });
  }

  public async findUserByToken(tokenId: Types.ObjectId): Promise<UserDocument> {
    const token = await this.tokenModel
      .findById(tokenId)
      .populate<{ userId: UserDocument | null }>('userId');
    if (!token) {
      // It's best to throw 401 here, since most likely, the token is invalid
      // or manually deleted from the database.
      throw new UnauthorizedException('No matching token found');
    }
    if (!token.userId) {
      // This should never happen, so it's best to throw 500 here.
      throw new InternalServerErrorException(
        'Token exists, but no matching user found',
      );
    }
    return token.userId;
  }

  /**
   * Returns the token document if it exists and is valid. Otherwise, returns
   * `null`.
   */
  public async findAndValidateToken(
    tokenId: Types.ObjectId,
  ): Promise<TokenDocument | null> {
    const token = await this.tokenModel.findById(tokenId);
    if (!token || !token.isActive) return null;
    return token;
  }
}
