import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TokenDto } from './token.dto';

export class CreateVendorDto extends TokenDto {
  // @IsString()
  // @IsOptional()
  // @ApiProperty()
  // user: string;

  // @IsOptional()
  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // fullName: string;

  // @IsOptional()
  // @ApiProperty({ required: false })
  // email: string;

  // @IsOptional()
  // @IsString()
  // @IsOptional()
  // @ApiProperty({ required: false })
  // country: string;

  // @IsOptional()
  // @ApiProperty({ type: 'string', format: 'binary', required: false })
  // ResidencyProof: any;
}
