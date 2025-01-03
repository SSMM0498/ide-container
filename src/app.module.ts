import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CRUDModule } from './events/crud/crud.module';
import { WatchModule } from './events/watch/watch.module';
import { TerminalModule } from './events/terminal/terminal.module';
import { CommandModule } from './events/command/command.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot(),
        // Import main app modules
        CRUDModule,
        WatchModule,
        TerminalModule,
        CommandModule
    ],
    controllers: [AppController],
})
export class AppModule { }