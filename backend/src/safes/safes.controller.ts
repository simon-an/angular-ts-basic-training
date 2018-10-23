import { Safe } from './interfaces/safe.interface';
import { CreateSafeDto } from './dto/create-safe.dto';
import { SafesService } from './safes.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('safes')
export class SafesController {
  constructor(private readonly safesService: SafesService) {}

  @Post()
  @UseGuards(AuthGuard('bearer'))
  async create(@Body() createSafeDto: CreateSafeDto) {
    this.safesService.create(createSafeDto);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  async findAll(): Promise<Safe[]> {
    return this.safesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('bearer'))
  async findOne(@Param('id') id): Promise<Safe | HttpException> {
    const foundSafe = this.safesService.findOne(id);
    if (!foundSafe) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return foundSafe;
  }
}
