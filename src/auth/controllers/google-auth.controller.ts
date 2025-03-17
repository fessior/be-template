import { Body, Controller, Post } from '@nestjs/common';

import { ConfigureAuth } from '../decorators';
import { GoogleLoginRequestDto, GoogleLoginResponseDto } from '../dtos';
import { GoogleAuthService } from '../services';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post()
  @ConfigureAuth({ skipAuth: true })
  public async login(
    @Body() dto: GoogleLoginRequestDto,
  ): Promise<GoogleLoginResponseDto> {
    const { accessToken } = await this.googleAuthService.authenticate(
      dto.idToken,
    );
    return new GoogleLoginResponseDto(accessToken);
  }
}
