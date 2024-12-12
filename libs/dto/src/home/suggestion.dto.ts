import { ApiProperty } from '@nestjs/swagger';

export class SuggestionCreateDto {
  @ApiProperty()
  message: string;
}
