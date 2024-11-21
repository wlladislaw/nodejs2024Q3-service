import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(login: string, password: string) {
    const user = await this.userService.findByLogin(login);
    if (user) {
      throw new BadRequestException('Login exists');
    }
    const salt = Number(process.env.CRYPT_SALT);

    const hashedPass = await bcrypt.hash(password, salt);

    await this.userService.create({ login, password: hashedPass });
  }

  async login(login: string, password: string) {
    const user = await this.userService.findByLogin(login);

    if (!user) {
      throw new ForbiddenException('User not founded by this login');
    }

    const isRightPass = await bcrypt.compare(password, user.password);

    if (!isRightPass) {
      throw new ForbiddenException('Invalid password');
    }

    const payload = { userId: user.id, login: user.login };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payloadFromClient = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
        },
      );
      const user = await this.userService.findUnique(payloadFromClient.userId);

      if (!user) {
        throw new ForbiddenException('User not found!');
      }

      const payload = { userId: user.id, login: user.login };

      const upAccessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      const upRefreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      return { accessToken: upAccessToken, refreshToken: upRefreshToken };
    } catch (error) {
      throw new ForbiddenException('Refresh token is invalid or expired');
    }
  }
}
