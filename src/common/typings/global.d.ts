import { TokenDocument } from '@/auth/schemas';
import { UserDocument } from '@/users/schemas';

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
      /**
       * This field can be checked to see if authenticated succeeded
       */
      user?: User;
    }

    interface User {
      token: TokenDocument;
      profile: UserDocument;
    }
  }
}

export {};
