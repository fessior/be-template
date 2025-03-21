import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { testApp, testModule } from '@test-helpers/setup-integration';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { Model } from 'mongoose';
import * as request from 'supertest';

import { UserMockData } from '@/users/mocks';
import { User } from '@/users/schemas';

const MOCK_USER = UserMockData.getUser();

describe('Testing Google auth APIs', () => {
  let userModel: Model<User>;
  let oauth2Client: DeepMocked<OAuth2Client>;

  beforeAll(() => {
    userModel = testModule.get<Model<User>>(getModelToken(User.name));
    oauth2Client = testModule.get(OAuth2Client);
  });

  describe('POST /api/v1/auth/google', () => {
    it('Should return 200 OK with an access token and insert new user, if given valid idToken', async () => {
      const ticket = createMock<LoginTicket>();
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

      const res = await request(testApp.getHttpServer())
        .post('/api/v1/auth/google')
        .send({ idToken: '123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');

      // Check for that user in the database
      const user = await userModel
        .findOne({ googleId: MOCK_USER.googleId })
        .lean();
      expect(user).toBeTruthy();
      expect(user?.lastName).toBe(MOCK_USER.lastName);
      expect(user?.firstName).toBe(MOCK_USER.firstName);
      expect(user?.email).toBe(MOCK_USER.email);
      expect(user?.avatarUrl).toBe(MOCK_USER.avatarUrl);
      expect(user?.googleId).toBe(MOCK_USER.googleId);
    });
  });
});
