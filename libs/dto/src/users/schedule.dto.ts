import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @ApiProperty()
  end_time: string;

  @IsString()
  @ApiProperty()
  start_time: string;

  @ApiProperty()
  break_time: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  employee: string;
}

export class SchedulePagingQueryDto {
  @ApiProperty()
  page_number: number;
  @ApiProperty()
  page_size: number;
}

export class UpdateScheduleDto {
  @ApiProperty()
  @IsOptional()
  end_time: string;

  @IsOptional()
  @ApiProperty()
  employee: string;

  @ApiProperty()
  @IsOptional()
  start_time: string;

  @ApiProperty()
  @IsOptional()
  break_time: string;

  @IsOptional()
  @ApiProperty()
  date: Date;
}
