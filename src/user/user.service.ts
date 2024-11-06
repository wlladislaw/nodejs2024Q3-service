import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-user.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  findMany(): User[] {
    return this.users;
  }

  findUnique(id: string): User | null {
    return this.users.find((user) => user.id === id);
  }

  create(userDto: CreateUserDto): User {
    const createdUser: User = {
      id: uuidv4(),
      login: userDto.login,
      password: userDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(createdUser);
    return createdUser;
  }

  update(id: string, passDto: UpdatePasswordDto): User {
    const user = this.users.find((user) => user.id === id);
    if (passDto.newPassword !== passDto.oldPassword)
      throw new ForbiddenException('Incorrect old password');
    console.log('passDto.newPassword: ', passDto.newPassword);
    console.log('passDto: ', passDto);

    user.password = passDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  delete(id: string): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
