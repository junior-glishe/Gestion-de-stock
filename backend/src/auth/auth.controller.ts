import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() body: Record<string, string>) {
    return this.auth.login(body);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Req() request: { headers: { authorization?: string }; user?: { id: number; email: string } }) {
    const token = (request.headers.authorization ?? '').replace(/^Bearer\s+/i, '').trim();
    return this.auth.logout(token, request.user);
  }
}
