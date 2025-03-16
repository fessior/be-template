import { UserDocument } from '@/users/schemas';

export type GoogleAuthResult = {
  user: UserDocument;
  accessToken: string;
};
