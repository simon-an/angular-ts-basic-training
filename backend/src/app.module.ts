import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SafesController } from './safes/safes.controller';
import { SafesService } from './safes/safes.service';

@Module({
  imports: [],
  controllers: [AppController, SafesController],
  providers: [AppService, SafesService],
})
export class AppModule {}
