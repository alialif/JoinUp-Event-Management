import { Controller, Post, Param, Get, Query, UseGuards, Req } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('certificates')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('certificates')
export class CertificatesController {
  constructor(private service: CertificatesService) {}

  @Post('issue/:registrationId')
  async issue(@Param('registrationId') registrationId: string, @Req() req: any) {
    return this.service.issue(registrationId, req.user.userId);
  }

  @Get('verify/:registrationId')
  async verify(@Param('registrationId') registrationId: string, @Query('code') code: string) {
    const valid = await this.service.verify(registrationId, parseInt(code));
    return { valid };
  }
}
