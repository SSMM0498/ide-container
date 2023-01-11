import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WatchController } from './watch.gateway';

@Module({
    imports: [ConfigModule],
    controllers: [WatchController]
})
export class WatchModule { }
