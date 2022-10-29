import { Controller, Get, Header, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import fs from 'fs';

@Controller('swagger-spec')
@ApiExcludeController()
export class SwaggerSpecController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @Header('content-type', 'application/json')
  async getSwaggerSpec() {
    return fs.readFileSync(
      './src/features/swagger-spec/swagger-spec.json',
      'utf8',
    );
  }
}
