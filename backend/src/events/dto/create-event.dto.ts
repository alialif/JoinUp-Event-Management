import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'Angular Workshop 2025',
    description: 'Title of the event',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'Learn Angular 20 with hands-on examples and best practices',
    description: 'Detailed description of the event',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: '2025-02-15T09:00:00.000Z',
    description: 'Start date and time in ISO format',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    example: '2025-02-15T17:00:00.000Z',
    description: 'End date and time in ISO format',
  })
  @IsDateString()
  endDate!: string;

  @ApiProperty({
    example: 50,
    description: 'Maximum number of participants allowed',
  })
  @IsNumber()
  maxRegistrations!: number;

  @ApiProperty({
    example: ['workshop', 'conference'],
    description: 'Event categories',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiProperty({
    example: 'free',
    description: 'Event price type',
    enum: ['free', 'paid'],
    required: false,
    default: 'free',
  })
  @IsOptional()
  @IsString()
  price?: string;
}
