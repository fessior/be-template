import { getModelToken } from '@nestjs/mongoose';
import { testApp, testModule } from '@test-helpers/setup-integration';
import { fakeSystemTime } from '@test-helpers/time';
import { signAccessToken } from '@test-helpers/token';
import { Model } from 'mongoose';
import * as request from 'supertest';

import { TokenMockData } from '@/auth/mocks';
import { Token } from '@/auth/schemas';
import { UserMockData } from '@/users/mocks';
import { User } from '@/users/schemas';

const MOCK_USER = UserMockData.getUser();
const VALID_TOKEN = TokenMockData.getValidToken(MOCK_USER);

describe('User APIs', () => {
  let userModel: Model<User>;
  let tokenModel: Model<Token>;

  beforeAll(() => {
    userModel = testModule.get<Model<User>>(getModelToken(User.name));
    tokenModel = testModule.get<Model<Token>>(getModelToken(Token.name));
  });

  beforeEach(async () => {
    // Prepare a default user in the database for testing
    await userModel.create(MOCK_USER);
    await tokenModel.create(VALID_TOKEN);
  });

  describe('GET /api/v1/users/me', () => {
    it('Should return current user profile with required fields', async () => {
      const accessToken = await signAccessToken(testModule, VALID_TOKEN);
      fakeSystemTime(TokenMockData.mockTimestamp);

      const res = await request(testApp.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        email: MOCK_USER.email,
        firstName: MOCK_USER.firstName,
        lastName: MOCK_USER.lastName,
        avatarUrl: MOCK_USER.avatarUrl,
      });
    });
  });
});
