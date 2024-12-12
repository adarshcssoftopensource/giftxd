import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from '../users/token.dto';

export class CreateSecurityQuestionAnswer extends TokenDto {
  @ApiProperty()
  questionsAndAnswer: object[];
}

export class GetListOfUser extends TokenDto {
  @ApiProperty({ type: Boolean, default: false })
  filter: boolean;
  @ApiProperty()
  pageNumber: number;
  @ApiProperty()
  pageSize: number;
}
