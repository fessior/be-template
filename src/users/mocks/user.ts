import { Types } from 'mongoose';

import { User } from '../schemas';

export class UserMock {
  public static getUser(): User {
    return {
      _id: new Types.ObjectId('65fbdb8e9c3a4f27b2e6a1d5'),
      email: 'johndoe@gmail.com',
      googleId: '1234567890',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: 'https://www.example.com/avatar.jpg',
    };
  }
}
