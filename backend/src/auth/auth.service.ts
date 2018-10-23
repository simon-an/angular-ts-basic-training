import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginData } from './logindata';
import { User } from 'users/interfaces/user.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  login(loginData: LoginData): string {
    const userFound: User = this.usersService
      .findAll()
      .filter(user => user.role === loginData.role)
      .find(user => user.name === loginData.email);
    if (userFound) {
      const token = uuid();
      this.usersService.login(userFound.id, token);
      return token;
    }
    throw new UnauthorizedException();
  }

  async validateUser(token: string): Promise<User> {
    // Validate if token passed along with HTTP request
    // is associated with any registered account in the database
    return await this.usersService.findOneByToken(token);
  }
}
