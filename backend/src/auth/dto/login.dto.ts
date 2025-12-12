import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@bootcamp.com',
    description: 'Email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Password',
  })
  @IsString()
  password!: string;
}
