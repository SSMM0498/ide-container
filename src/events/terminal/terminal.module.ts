import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminalGateway } from './terminal.gateway';

@Module({
    imports: [ConfigModule],
    providers: [TerminalGateway]
})
export class TermModule { }
