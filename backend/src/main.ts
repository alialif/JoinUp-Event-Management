import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('JoinUp - Event Management API')
    .setDescription(
      '🤖 AI-Generated REST API for event management system.\n\n' +
      'This API provides comprehensive endpoints for managing events, member registrations, ' +
      'attendance tracking, and certificate generation with QR code validation.\n\n' +
      '**Features:**\n' +
      '- JWT-based authentication\n' +
      '- Role-based access control (admin/staff/participant)\n' +
      '- Event CRUD operations with categories and pricing\n' +
      '- Member registration with gender field\n' +
      '- Attendance tracking\n' +
      '- PDF certificate generation with QR codes\n' +
      '- Comprehensive audit logging\n\n' +
      '**Test Credentials:**\n' +
      '- Admin: admin@bootcamp.com / admin123\n' +
      '- Staff: staff@bootcamp.com / staff123\n' +
      '- Participant: participant1@bootcamp.com / participant123'
    )
    .setVersion('1.0.0')
    .setContact(
      'Leandro da Silva',
      'https://github.com/leandrowcs/JoinUp-Event-Management',
      'leandro.dasilva@example.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from /auth/login endpoint',
      },
      'bearer'
    )
    .addTag('auth', 'Authentication and user management endpoints')
    .addTag('events', 'Event CRUD operations')
    .addTag('registrations', 'Event registration management')
    .addTag('attendance', 'Attendance tracking')
    .addTag('certificates', 'Certificate generation and verification')
    .addTag('audit', 'Audit logs for system activities')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'JoinUp API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(3000);
  console.log('🚀 Application is running on: http://localhost:3000');
  console.log('📚 API Documentation available at: http://localhost:3000/api/docs');
}
bootstrap();
