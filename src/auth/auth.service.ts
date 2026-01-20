import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      // สามารถเพิ่ม refresh_token ภายหลังได้
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(email, pass);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}