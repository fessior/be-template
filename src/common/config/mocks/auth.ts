import { AuthConfig } from '@/common/config';

export const MOCK_AUTH_CONFIG: AuthConfig = {
  google: {
    clientId: 'google-client-id',
    clientSecret: 'google-client-secret',
  },
  jwtSecret: 'jwt-secret',
};
