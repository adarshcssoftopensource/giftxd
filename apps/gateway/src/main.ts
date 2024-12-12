import { NestFactory, NestApplication } from '@nestjs/core';
import { SwaggerUIExtended, MyHttpExceptionFilter } from '@app/common';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
const swagger_option = {
  title: 'Gift app',
  description: 'this is backend apis',
  version: '1.0.0',
  path: 'api',
};

async function init() {
  console.log(process.env.ssl);
  let httpOptions = undefined;
  if (JSON.parse(process.env.ssl)) {
    httpOptions = {
      cert: readFileSync(process.env.CERT_KEY),
      key: readFileSync(process.env.PRIVATE_KEY),
    };
  }
  const app = await NestFactory.create(AppModule, httpOptions);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          type: 'field',
          value: error.value,
          msg: error.constraints[Object.keys(error.constraints)[0]],
          path: error.property,
          // property: error.property,
          // message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  app.useGlobalFilters(new MyHttpExceptionFilter());
  new SwaggerUIExtended(app as NestApplication, swagger_option).create();
  await app.listen(7370);
  console.log('Gateway runned successfuly at 7370');
}

init();
