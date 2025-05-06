import { ArrayMaxSize, IsArray, IsNumber, Max, Min } from 'class-validator';

export class GenerateDto {
  @IsNumber({}, { each: true })
  @IsArray()
  @ArrayMaxSize(26)
  items: number[];

  @IsNumber()
  @Min(1)
  @Max(10)
  length: number;
}
