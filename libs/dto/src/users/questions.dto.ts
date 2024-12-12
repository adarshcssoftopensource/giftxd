import { ApiProperty } from '@nestjs/swagger';

export class QuestionCreateDto {
  @ApiProperty()
  question: string;
}
