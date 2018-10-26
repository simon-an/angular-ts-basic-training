import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  HttpCode,
  UseInterceptors,
  FileInterceptor,
  UploadedFile,
  Header,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('filename'))
  async upload(@UploadedFile() file) {
    return this.files.create(file);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  findAll(): string[] {
    return this.files.findAll();
  }

  @Get(':id')
  // @UseGuards(AuthGuard('bearer'))
  @Header('content-type', 'image/jpeg')
  findOne(@Param('id') id): any | HttpException {
    const foundSafe = this.files.findOne(id);
    if (!foundSafe) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return foundSafe;
  }

  // @Get()
  // @UseGuards(AuthGuard('bearer'))
  // async findAll(): Promise<File[]> {
  //   return this.files.findAll().toPromise();
  // }
}
