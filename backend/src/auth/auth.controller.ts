import { Controller, Post, Body, Put, Param, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { MemberRole } from '../entities/member.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new member' })
  @ApiResponse({
    status: 201,
    description: 'Member successfully registered',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'participant',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() dto: RegisterDto) {
    const birthDate = dto.birthDate ? new Date(dto.birthDate) : undefined;
    const member = await this.authService.register(dto.email, dto.password, dto.name, undefined, birthDate, dto.gender);
    return { id: member.id, email: member.email, name: member.name, role: member.role };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        member: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'admin@bootcamp.com',
          name: 'Admin User',
          role: 'admin',
          birthDate: '1990-05-15T00:00:00.000Z',
          gender: 'male',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Put('promote/:memberId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Promote a member to staff role (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Member successfully promoted',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        name: 'User Name',
        role: 'staff',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async promoteToStaff(@Param('memberId') memberId: string) {
    return this.authService.promoteToStaff(memberId);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all registered members (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all members',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'admin@bootcamp.com',
          name: 'Admin User',
          role: 'admin',
          birthDate: '1985-03-20T00:00:00.000Z',
          gender: 'male',
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          email: 'staff@bootcamp.com',
          name: 'Staff User',
          role: 'staff',
          birthDate: '1992-07-10T00:00:00.000Z',
          gender: 'female',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllMembers() {
    return this.authService.getAllMembers();
  }

  @Put('members/:memberId/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MemberRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change member role (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Member role successfully changed',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        name: 'User Name',
        role: 'staff',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async changeRole(@Param('memberId') memberId: string, @Body() dto: ChangeRoleDto) {
    return this.authService.changeRole(memberId, dto.role);
  }
}
