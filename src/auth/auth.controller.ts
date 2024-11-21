import { Public } from './../commonDecorators/public/authz.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthDto) {
    await this.authService.signUp(dto.login, dto.password);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto) {
    const tokens = await this.authService.login(dto.login, dto.password);
    return tokens;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: RefreshTokenDto) {
    const tokens = this.authService.refreshToken(refreshToken);
    return tokens;
  }
}
