import { AuthService } from 'app/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';

describe('FileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService]
    });
  });

  it('should be created', () => {
    const httpMock = TestBed.get(HttpTestingController);
    const service: FileService = TestBed.get(FileService);
    expect(service).toBeTruthy();
  });
});
