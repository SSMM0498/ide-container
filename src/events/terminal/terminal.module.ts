import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminalGateway } from './terminal.gateway';
import { TerminalService } from './terminal.service';

@Module({
    imports: [ConfigModule],
    providers: [TerminalGateway, TerminalService],
    exports: [TerminalService]
})
export class TerminalModule { }
