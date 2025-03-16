import { Controller } from '@nestjs/common';

import { UserService } from '../services';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
