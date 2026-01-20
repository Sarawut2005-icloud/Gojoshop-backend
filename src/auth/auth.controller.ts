import { UnauthorizedException } from '@nestjs/common'; // ← เพิ่มบรรทัดนี้
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service'; // ← เพิ่มบรรทัดนี้
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // ← เพิ่มบรรทัดนี้
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.create(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );
    return this.authService.login(user);
  }

  // ถ้ายังใช้ local strategy (สำหรับ login ธรรมดา)
  // @UseGuards(AuthGuard('local'))
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
    return this.authService.login(user);
  }
}