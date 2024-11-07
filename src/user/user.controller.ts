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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { isUUID } from 'class-validator';

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
    if(!user  ) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND)
    }

  }

  @Post()
  create(@Body() createDto: CreateUserDto): User {
    return this.userService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdatePasswordDto): User {
    console.log('updateDto: ', updateDto);
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    if (updateDto.newPassword === undefined || updateDto.oldPassword === undefined) throw new BadRequestException('Fields empty');
    return this.userService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    this.userService.delete(id);
  }
}
