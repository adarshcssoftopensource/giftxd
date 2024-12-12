import { roleType } from '@app/schemas/users/role.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsEnum(roleType)
  @ApiProperty({ default: roleType.Client })
  name: roleType;

  @ApiProperty()
  permissions: object;
}

export class UpdateRoleDto {
  @IsEnum(roleType)
  @ApiProperty()
  @IsOptional()
  name: roleType;

  @ApiProperty()
  permissions: object;
}
