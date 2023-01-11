import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    const port = app.get(ConfigService).get('COMMUNICATION_PORT')
    await app.listen(port);

    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();