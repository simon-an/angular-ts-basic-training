import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

export interface Mapping {
  [key: string]: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  private readonly tokens: Mapping = {};

  constructor() {
    this.users.push({
      id: '1',
      name: 'simon.potzernheim@metafinanz.de',
      role: 'user',
    } as User);
    this.users.push({
      id: 'Admin1',
      name: 'simon.potzernheim@metafinanz.de',
      role: 'admin',
    } as User);
  }

  create(user: User) {
    this.users.push(user);
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    return this.users.find(user => user.id === id);
  }

  // findByEmail(email: string) {
  //   return this.users.find(user => user.name === email);
  // }

  findOneByToken(token) {
    return this.findOne(this.tokens[token]);
  }

  login(userId, token): boolean {
    if (this.findOne(userId)) {
      // console.log(Object.keys(this.tokens));

      for (const key in this.tokens) {
        if (this.tokens.hasOwnProperty(key)) {
          const value = this.tokens[key];
          if (value === userId) {
            delete this.tokens[key];
          }
        }
      }

      this.tokens[token] = userId;
      return true;
    }
    return false;
  }
}
