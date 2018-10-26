import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { SafesController } from './safes/safes.controller';
import { SafesService } from './safes/safes.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from 'files/files.module';

@Module({
  imports: [AuthModule, UsersModule, FilesModule],
  controllers: [SafesController],
  providers: [AppService, SafesService],
})
export class AppModule {}
