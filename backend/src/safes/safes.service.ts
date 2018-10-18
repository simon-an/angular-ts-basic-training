import { Safe } from './interfaces/safe.interface';
import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class SafesService {
  private readonly safes: Safe[] = [];

  create(safe: Safe) {
    console.log(safe);
    this.safes.push(safe);
  }

  findAll(): Safe[] {
    return this.safes;
  }

  findOne(id: string): Safe {
    return this.safes.filter(safe => safe.id === id)[0];
  }
}
