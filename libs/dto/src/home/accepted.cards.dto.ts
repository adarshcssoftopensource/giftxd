import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export const ApiFile = (options?: ApiPropertyOptions): PropertyDecorator => (
    target: Object,
    propertyKey: string | symbol,
  ) => {
    if (options?.isArray) {
      ApiProperty({
        type: 'array',
        items: {
          type: 'file',
          properties: {
            [propertyKey]: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })(target, propertyKey);
    } else {
      ApiProperty({
        type: 'file',
        properties: {
          [propertyKey]: {
            type: 'string',
            format: 'binary',
          },
        },
      })(target, propertyKey);
    }
  };


export class AcceptedCardDto {
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    cardImage: string;
}

export class CreateAcceptedCardDto {    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiFile()
    file: Express.Multer.File; 
}

export class UpdateAcceptedCardDto{
    @ApiProperty()
    @IsString()
    id: string;

    @ApiFile()
    file: Express.Multer.File; 
}