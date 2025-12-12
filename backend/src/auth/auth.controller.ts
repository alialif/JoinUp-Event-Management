import { Controller, Post, Body, Put, Param, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { MemberRole } from '../entities/member.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string; role?: string; birthDate?: string; gender?: string }) {
    const birthDate = body.birthDate ? new Date(body.birthDate) : undefined;
    const member = await this.authService.register(body.email, body.password, body.name, body.role as any, birthDate, body.gender);
    return { id: member.id, email: member.email, name: member.name, role: member.role };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Put('promote/:memberId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN)
  @ApiBearerAuth()
  async promoteToStaff(@Param('memberId') memberId: string) {
    return this.authService.promoteToStaff(memberId);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN)
  @ApiBearerAuth()
  async getAllMembers() {
    return this.authService.getAllMembers();
  }

  @Put('members/:memberId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN)
  @ApiBearerAuth()
  async changeRole(@Param('memberId') memberId: string, @Body() body: { role: string }) {
    return this.authService.changeRole(memberId, body.role as MemberRole);
  }
}
