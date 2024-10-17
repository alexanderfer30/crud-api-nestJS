import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginAuthDTO } from './dto/auth-login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() LoginDTO: LoginAuthDTO){
  return this.authService.login(LoginDTO);
  }
}
