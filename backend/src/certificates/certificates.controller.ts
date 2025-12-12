import { Controller, Post, Param, Get, Query, UseGuards, Req } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('certificates')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('certificates')
export class CertificatesController {
  constructor(private service: CertificatesService) {}

  @Post('issue/:registrationId')
  @ApiOperation({ summary: 'Issue a certificate for a registration (generates PDF with QR code)' })
  @ApiResponse({
    status: 201,
    description: 'Certificate successfully issued',
    schema: {
      example: {
        id: '723e4567-e89b-12d3-a456-426614174006',
        registration: {
          id: '523e4567-e89b-12d3-a456-426614174004',
          member: {
            name: 'John Doe',
          },
          event: {
            title: 'Angular Workshop 2025',
          },
        },
        issuedAt: '2025-02-15T18:00:00.000Z',
        issuedBy: {
          name: 'Staff User',
        },
        verificationCode: 1234,
        pdfPath: 'certificates/cert-723e4567-e89b-12d3-a456-426614174006.pdf',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Registration not found' })
  async issue(@Param('registrationId') registrationId: string, @Req() req: any) {
    return this.service.issue(registrationId, req.user.userId);
  }

  @Get('verify/:registrationId')
  @ApiOperation({ summary: 'Verify a certificate using QR code' })
  @ApiQuery({ name: 'code', description: 'Verification code from QR code', example: '1234' })
  @ApiResponse({
    status: 200,
    description: 'Certificate verification result',
    schema: {
      example: {
        valid: true,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Certificate not found' })
  async verify(@Param('registrationId') registrationId: string, @Query('code') code: string) {
    const valid = await this.service.verify(registrationId, parseInt(code));
    return { valid };
  }
}
