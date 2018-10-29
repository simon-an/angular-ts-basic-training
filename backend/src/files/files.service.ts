import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { FileDto } from './file.dto';
import sharp = require('sharp');
import { StoredFile } from './storedFile';

@Injectable()
export class FilesService {
  files: StoredFile[] = [];
  constructor() {}

  create(fileX: FileDto): string {
    // console.log(fileX);
    const file: StoredFile = {
      file: fileX,
      id: uuid(),
      approved: false,
    } as StoredFile;
    this.files = [...this.files, file];

    return file.id;
  }

  findAll(): string[] {
    return this.files.map(file => file.id);
  }

  async bufferToWebP(buffer): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      sharp(buffer)
        .resize(320, 240)
        // .toFile('output.webp', (err, info) => {
        //   console.log('x', err, info);
        // })
        .toBuffer((err, info) => {
          // console.log('x', err, info);
          if (err) {
            reject(err);
          }
          const encoded = `data:image/webp;base64,${info.toString('base64')}`;
          resolve(encoded);
          // resolve(info);
        });
    });
  }

  bufferToImg(buffer) {
    const encoded = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return encoded;
  }

  findOne(id: string) {
    const found: StoredFile = this.files.find(file => file.id === id);
    console.log(found);
    if (found && found.file) {
      return found.file.buffer;
    }
    return null;
  }
}
