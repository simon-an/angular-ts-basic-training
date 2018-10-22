import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  file = null;

  constructor() {}

  uploadFile(file: string | ArrayBuffer): string {
    this.file = file;
    return 'c1b16842-826a-40b0-a2d9-dc9359fb9582';
  }
}
