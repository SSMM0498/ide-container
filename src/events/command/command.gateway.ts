import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { CommandService } from './command.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommandGateway {
  constructor(private commandService: CommandService) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('command-run')
  async handleRunCommand(@MessageBody() command: string) {
    const result = await this.commandService.runCommand();
    return { event: 'command-result', data: result };
  }

  @SubscribeMessage('command-preview')
  async handlePreviewCommand(@MessageBody() command: string) {
    const result = await this.commandService.previewCommand();
    if (result.startsWith('Command executed: ')) {
      const previewUrl = this.commandService.getPreviewUrl();
      return { event: 'command-result-preview', data: previewUrl };
    }
    return { event: 'command-result-preview', data: result };
  }
}
