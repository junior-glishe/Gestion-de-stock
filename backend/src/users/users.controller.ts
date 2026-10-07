import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

@Controller('utilisateurs')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.users();
  }

  @Post()
  create(@Body() body: Record<string, string>) {
    return this.users.createUser(body);
  }

  @Patch(':email/actif')
  toggle(@Param('email') email: string, @Body() body: { actif?: boolean }) {
    return this.users.toggleUser(email, body.actif);
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.users.deleteUser(email);
  }
}
