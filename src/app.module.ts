import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CRUDModule } from './events/crud/crud.module';
import { WatchModule } from './events/watch/watch.module';
import { TermModule } from './events/terminal/terminal.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        CRUDModule,
        WatchModule,
        TermModule
    ],
})
export class AppModule { }