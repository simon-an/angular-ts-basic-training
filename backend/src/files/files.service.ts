import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'users/interfaces/user.interface';
import { v4 as uuid } from 'uuid';
import { FileDto } from './file.dto';

@Injectable()
export class FilesService {
  files = [];
  constructor() {}

  create(dto: FileDto): string {
    console.log(dto);
    const file = {
      file: dto,
      id: uuid(),
      approved: false,
    };
    this.files = [...this.files, file];
    return file.id;
  }

  findAll() {
    return this.files;
  }

  findOne(id: string) {
    return this.files.find(file => file.id === id).file.buffer;
  }
}
