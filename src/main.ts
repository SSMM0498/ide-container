import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application
 */
async function bootstrap() {
    // Create a new NestJS application instance
    const app = await NestFactory.create(AppModule);

    // Enable Cross-Origin Resource Sharing (CORS)
    app.enableCors();

    // Add global validation pipe for request data validation
    app.useGlobalPipes(new ValidationPipe());

    // Get the port from configuration service or environment variables
    const port = app.get(ConfigService).get('COMMUNICATION_PORT')
    await app.listen(process.env.PORT || port);

    // Log the application URL once it's running
    console.log(`👟 Application is running on - COMMAND: ${await app.getUrl()}`);
}

// Execute the bootstrap function
bootstrap();