import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { LoginData } from './logindata';
import { AuthService } from './auth.service';
import { User } from 'users/interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  login(@Body() loginData: LoginData): any {
    return { token: this.authService.login(loginData) };
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  async validateToken(@Headers() token: any): Promise<User> {
    return this.authService.validateUser(token.authorization.slice(7));
  }
}
