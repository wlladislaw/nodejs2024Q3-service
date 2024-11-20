import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
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

    const hashedPass = await bcrypt.hash(password, 10);
    console.log('hashedPass: ', hashedPass);

    await this.userService.create({ login, password: hashedPass });

    return 'User created';
  }

  async login(login: string, password: string) {
    const user = await this.userService.findByLogin(login);

    if (!user) {
      throw new ForbiddenException('User not founded');
    }

    const isRightPass = await bcrypt.compare(password, user.password);
    if (!isRightPass) {
      throw new ForbiddenException('Invalid credentials');
    }

    const payload = { userId: user.id, login: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1m',
      }),
    };
  }
}
