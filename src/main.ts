import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fs from 'fs';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ngrok from 'ngrok';

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  const logger = new Logger(AppModule.name);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Universal Jewellery System API')
      .setDescription('API for the Universal Jewellery System')
      .setVersion('0.0.1')
      .addOAuth2(
        {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: `${configService.get(
                'AUTH0_AUTH_URL',
              )}?audience=${configService.get('AUTH0_AUDIENCE')}`,
              tokenUrl: configService.get('AUTH0_TOKEN_URL'),
              refreshUrl: configService.get('AUTH0_REFRESH_URL'),
              scopes: {
                openid: 'Open Id',
                profile: 'Profile',
                email: 'E-mail',
              },
            },
          },
          scheme: 'Bearer',
          bearerFormat: 'JWT',
          in: 'header',
          openIdConnectUrl: configService.get('AUTH0_OPEN_ID_URL'),
        },
        'Auth0',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync(
      './src/features/swagger-spec/swagger-spec.json',
      JSON.stringify(document),
    );
    SwaggerModule.setup('/', app, document, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        initOAuth: {
          clientId: configService.get('AUTH0_CLIENT_ID'),
          clientSecret: configService.get('AUTH0_CLIENT_SECRET'),
          scopes: ['openid', 'profile', 'email'],
        },
      },
    });

    const url = await ngrok.connect({
      region: 'eu',
      addr: port,
      authtoken: configService.get('NGROK_AUTH_TOKEN'),
      subdomain: configService.get('NGROK_SUBDOMAIN'),
    });

    logger.log(`Ngrok is running on: ${url}`);
  }

  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
