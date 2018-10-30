import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'bearer' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HttpStrategy],
  exports: [AuthService],
})
export class AuthModule {}
