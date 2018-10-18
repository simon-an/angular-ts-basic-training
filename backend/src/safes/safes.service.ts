import { Safe } from './interfaces/safe.interface';
import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class SafesService {
  private readonly safes: Safe[] = [];

  create(safe: Safe) {
    this.safes.push(safe);
  }

  findAll(): Safe[] {
    return this.safes;
  }

  findOne(id: string): Safe {
    return this.safes.find(safe => safe.id === id);
  }
}
