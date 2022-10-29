import { Module } from '@nestjs/common';
import { SwaggerSpecController } from './swagger-spec.controller';

@Module({
  controllers: [SwaggerSpecController],
})
export class SwaggerSpecModule {}
