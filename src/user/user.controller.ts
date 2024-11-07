import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { isUUID } from 'class-validator';
import { PasswordInterceptor } from './interceptors/password.interceptor';

@UseInterceptors(PasswordInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findMany(): User[] {
    return this.userService.findMany();
  }

  @Get(':id')
  findUnique(@Param('id') id: string): User {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    const user = this.userService.findUnique(id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }

  @Post()
  create(@Body() createDto: CreateUserDto): User {
    if (!createDto.login || !createDto.password)
      throw new BadRequestException('Required fields empty');
    return this.userService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePasswordDto): User {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    if (
      updateDto.newPassword === undefined ||
      updateDto.oldPassword === undefined
    )
      throw new BadRequestException('Fields empty');
    const updatedUser = this.userService.update(id, updateDto);
    if (!updatedUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      return updatedUser;
    }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    this.userService.delete(id);
  }
}
