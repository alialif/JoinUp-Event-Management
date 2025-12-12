import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address for login',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password (minimum 6 characters)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Birth date in ISO format (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    example: 'male',
    description: 'Gender of the user',
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other', 'prefer_not_to_say'])
  gender?: string;
}
