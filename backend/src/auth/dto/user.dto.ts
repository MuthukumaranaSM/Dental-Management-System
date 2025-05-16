import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ required: false })
  specialization?: string;

  @ApiProperty({ required: false })
  licenseNumber?: string;

  @ApiProperty({ required: false })
  shift?: string;
}
