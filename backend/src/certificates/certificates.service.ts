import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from '../entities/certificate.entity';
import { Registration } from '../entities/registration.entity';
import * as QRCode from 'qrcode';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate) private certRepo: Repository<Certificate>,
    @InjectRepository(Registration) private regRepo: Repository<Registration>,
    private auditService: AuditService
  ) {}

  async issue(registrationId: string, actorId: string): Promise<Certificate> {
    const reg = await this.regRepo.findOne({ where: { id: registrationId }, relations: ['member', 'event'] });
    if (!reg) throw new BadRequestException('Registration not found');

    const existing = await this.certRepo.findOne({ where: { registration: { id: registrationId } } });
    if (existing) return existing;

    // Generate QR data: registrationId|sequentialCode
    const qrData = `${reg.id}|${reg.sequentialCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    // Generate PDF via Puppeteer
    const html = this.generateCertificateHTML(reg, qrCodeDataUrl);
    const pdfPath = await this.generatePDF(html, `cert-${reg.id}.pdf`);

    const cert = this.certRepo.create({ registration: reg, filePath: pdfPath });
    const saved = await this.certRepo.save(cert);

    await this.auditService.log(actorId, 'certificate.issue', 'Certificate', saved.id);
    return saved;
  }

  async verify(registrationId: string, code: number): Promise<boolean> {
    const reg = await this.regRepo.findOne({ where: { id: registrationId } });
    return reg?.sequentialCode === code;
  }

  private generateCertificateHTML(reg: Registration, qrCodeDataUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
    h1 { color: #E63888; font-size: 48px; }
    p { font-size: 20px; margin: 20px 0; }
    .qr { margin-top: 30px; }
  </style>
</head>
<body>
  <h1>Certificate of Participation</h1>
  <p>This certifies that</p>
  <h2>${reg.member.name}</h2>
  <p>has successfully participated in</p>
  <h3>${reg.event.title}</h3>
  <p>Code: ${reg.sequentialCode}</p>
  <div class="qr">
    <img src="${qrCodeDataUrl}" alt="QR Code" />
  </div>
</body>
</html>
    `;
  }

  private async generatePDF(html: string, filename: string): Promise<string> {
    const outputDir = path.join(process.cwd(), 'certificates');
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, filename);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: outputPath, format: 'A4', landscape: true });
    await browser.close();

    return outputPath;
  }
}
