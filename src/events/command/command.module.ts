import { Module } from '@nestjs/common';
import { CommandGateway } from './command.gateway';
import { CommandService } from './command.service';
import { TerminalModule } from '../terminal/terminal.module';
import { TerminalGateway } from '../terminal/terminal.gateway';

@Module({
  imports: [TerminalModule],
  providers: [CommandGateway, CommandService],
})
export class CommandModule { }
