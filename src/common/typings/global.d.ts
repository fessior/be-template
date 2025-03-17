import { Token } from '@/auth/schemas';
import { User } from '@/users/schemas';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;
      DB_URI: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      JWT_SECRET: string;
    }
  }

  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }

    interface AuthenticatedUser {
      token: Token;
      profile: User;
    }
  }
}

export {};
