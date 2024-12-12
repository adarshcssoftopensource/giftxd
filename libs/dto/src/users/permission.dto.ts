import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsObject,
  IsNumber,
  IsNumberString,
} from 'class-validator';

enum AccessEnum {
  ALLOW = 'allow',
  GRANTED = 'granted',
  DENY = 'deny',
}
class PermissionFields {
  @IsBoolean()
  @ApiProperty()
  is_selected: boolean;

  @IsEnum(AccessEnum)
  @ApiProperty()
  access: string;
}

export class PermisssionCreateDto {
  @IsString()
  @ApiProperty()
  role: string;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  new_post: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  notification: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  download_vault_content: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  queue: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  collections: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  statements: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  statistics: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  profile: PermissionFields;

  @IsObject()
  @ApiProperty({ type: PermissionFields })
  settings: PermissionFields;
}

export class GetAllPermissionDto {
  @ApiProperty()
  @IsNumberString()
  page_number: string;

  @ApiProperty()
  @IsNumberString()
  page_size: string;
}
