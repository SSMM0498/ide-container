import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(app.get(ConfigService).get('COMMUNICATION_PORT'));

    console.log(`Application is running on: ${await app.getUrl()}`);
    //    app.get(EventsGateway).server.emit('events-to-client', { name: 'Nest' });
}
bootstrap();