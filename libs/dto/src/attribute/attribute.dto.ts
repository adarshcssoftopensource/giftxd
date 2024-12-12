import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TokenDto } from '../users/token.dto';
export class CreateAttribueDto extends TokenDto {
  @IsString()
  @ApiProperty()
  name: string;


  @ApiProperty()
  provider: string;


  @IsString()
  @ApiProperty()
  @IsOptional()
  parent_id: string;
}

export class UpdateAttributeDto extends TokenDto {
  @IsString()
  @ApiProperty()
  name: string;
}

export class queryatributeDto extends TokenDto{
  @ApiProperty()
  provider: string;

}
