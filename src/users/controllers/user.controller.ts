import { Controller, Get } from '@nestjs/common';

import { MyProfileResponse } from '../dtos';
import { UserService } from '../services';
import { ReqUser } from '@/auth/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  public myProfile(
    @ReqUser() authUser: Express.AuthenticatedHttpUser,
  ): MyProfileResponse {
    // We assume that we're already authenticated, therefore it's safe to return
    // the user object directly
    return new MyProfileResponse(authUser.profile);
  }
}
