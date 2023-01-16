import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WatchGateway } from './watch.gateway';

@Module({
    imports: [ConfigModule],
    providers: [WatchGateway]
})
export class WatchModule { }
