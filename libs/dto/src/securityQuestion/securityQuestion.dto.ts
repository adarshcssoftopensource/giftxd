import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from '../users/token.dto';

export class CreateSecurityQuestion extends TokenDto {
  @ApiProperty()
  question: string;
}

export class UpdateSecurityQuestion extends TokenDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  question: string;
}
