import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { authorizationMiddleware } from './authorization.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.use(authorizationMiddleware);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
