import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CRUDModule } from './events/crud/crud.module';
import { WatchModule } from './events/watch/watch.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        CRUDModule,
        WatchModule
    ],
})
export class AppModule { }