import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MemberRole } from '../../entities/member.entity';

export class ChangeRoleDto {
  @ApiProperty({
    example: 'staff',
    description: 'New role for the user',
    enum: ['admin', 'staff', 'participant'],
  })
  @IsEnum(MemberRole)
  role!: MemberRole;
}
