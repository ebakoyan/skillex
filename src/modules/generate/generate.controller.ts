import { Body, Controller, Post } from '@nestjs/common';
import { GenerateDto } from './generate.dto';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  generate(@Body() dto: GenerateDto) {
    return this.generateService.generate(dto);
  }
}
