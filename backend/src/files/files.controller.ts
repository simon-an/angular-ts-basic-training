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
  Headers,
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
    if (file) {
      return this.files.create(file);
    }
    return new HttpException('Request was empty', HttpStatus.BAD_REQUEST);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  findAll(): string[] {
    return this.files.findAll();
  }

  @Get(':id')
  // @UseGuards(AuthGuard('bearer'))
  @Header('cache-control', 'no-cache')
  findOne(
    @Param('id') id,
    @Headers('accept') headers,
  ): string | Promise<any> | HttpException {
    // console.log('headers', headers);
    const foundSafe = this.files.findOne(id);
    if (!foundSafe) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    // if (headers && headers.includes('image/webp')) {
    return this.files.bufferToWebP(foundSafe);
    // } else {
    // return foundSafe;
    // return this.files.bufferToImg(foundSafe);
    // }
    // return foundSafe;
  }

  // @Get(':id')
  // // @UseGuards(AuthGuard('bearer'))
  // @Header('cache-control', 'no-cache')
  // getJpeg(@Param('id') id, @Headers('accept') headers): string | HttpException {
  //   // console.log('headers', headers);
  //   const foundSafe = this.files.findOne(id);
  //   if (!foundSafe) {
  //     throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  //   }
  //   return this.files.bufferToImg(foundSafe);
  // }
}
