import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import fs from 'fs';

@Controller('swagger-spec')
export class SwaggerSpecController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @Header('content-type', 'application/json')
  async getSwaggerSpec() {
    if (process.env.NODE_ENV === 'production')
      throw new UnauthorizedException('Not allowed in production');

    return fs.readFileSync(
      './src/features/swagger-spec/swagger-spec.json',
      'utf8',
    );
  }
}
