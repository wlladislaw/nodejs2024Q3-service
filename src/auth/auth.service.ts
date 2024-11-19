import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto:AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { dto.login },
    });


  }

  async login(dto:AuthDto) {
    const user = await this.prisma.user.findUnique({ where: { dto.login } });

    if (!user) {
      throw new ForbiddenException('invalid credentials');
    }

  }
}
