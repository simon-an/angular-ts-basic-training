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
import { SafeItem } from './interfaces/safeitem';

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
    return this.safesService.findAll().toPromise();
  }

  @Get(':id')
  @UseGuards(AuthGuard('bearer'))
  async findOne(@Param('id') id): Promise<Safe | HttpException> {
    const foundSafe = this.safesService.findOne(id);
    if (!foundSafe) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return foundSafe.toPromise();
  }

  @Get(':id/items')
  @UseGuards(AuthGuard('bearer'))
  async getAll(@Param('id') id): Promise<SafeItem[] | HttpException> {
    const items = this.safesService.getItems(id);
    if (!items) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return items.toPromise();
  }

  @Post(':id/items')
  @UseGuards(AuthGuard('bearer'))
  async newItem(
    @Param('id') id,
    @Body() dto: SafeItem,
  ): Promise<SafeItem | HttpException> {
    const item = this.safesService.addItem(dto, id);
    if (!item) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return item.toPromise();
  }
}
