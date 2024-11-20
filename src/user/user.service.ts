import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findMany() {
    const users = await this.prisma.user.findMany();

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    }));
  }

  async findUnique(id: string): Promise<User> | null {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user) {
      return {
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
    } else {
      return null;
    }
  }

  async findByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        login: userDto.login,
        password: userDto.password,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      ...createdUser,
      createdAt: createdUser.createdAt.getTime(),
      updatedAt: createdUser.updatedAt.getTime(),
    };
  }

  async update(id: string, passDto: UpdatePasswordDto): Promise<User> {
    const user = await this.findUnique(id);

    if (user) {
      if (passDto.oldPassword !== user.password)
        throw new ForbiddenException('Incorrect old password');

      const password = passDto.newPassword;
      const version = (user.version += 1);

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          password: password,
          version: version,
          updatedAt: new Date(),
        },
      });

      return {
        ...updatedUser,
        createdAt: updatedUser.createdAt.getTime(),
        updatedAt: updatedUser.updatedAt.getTime(),
      };
    } else {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    const user = await this.findUnique(id);
    if (user) {
      await this.prisma.user.delete({
        where: { id },
      });
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
