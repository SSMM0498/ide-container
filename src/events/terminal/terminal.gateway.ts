import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Observable, Observer } from 'rxjs';
import { Server } from 'socket.io';
import { EOL } from 'os';
import { TerminalService } from './terminal.service';
import { bright, blue, green, reset, BgWhite, arkadLogo } from 'src/constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TerminalGateway {
  constructor(private terminalService: TerminalService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('terminal-input')
  async inputTerminal(@MessageBody() eventData: string) {
    console.log('⌨️ START TERMINAL INPUT');
    this.terminalService.terminalProcess.write(eventData);
  }

  @SubscribeMessage('terminal')
  initConnexion(): Observable<WsResponse<string>> {
    console.log('🖥️ START TERMINAL');

    return new Observable((observer: Observer<WsResponse<string>>) => {
      console.log('👀 START TERMINAL OBSERVABLE');

      observer.next({
        event: 'terminal-data',
        data: `${bright}${blue}${arkadLogo}${reset}${EOL}`,
      });

      observer.next({
        event: 'terminal-data',
        data: `${BgWhite}${bright}${blue}Connected! Welcome to arkad!${reset}${EOL}${EOL}`,
      });

      observer.next({
        event: 'terminal-data',
        data: `${bright}${green}arkad@${this.terminalService.hostname.split('.')[0]}${reset}:${bright}${blue}~/code${reset}$ `,
      });

      this.terminalService.terminalProcess.onData((data) => {
        console.log('📥 START TERMINAL DATA');
        observer.next({ event: 'terminal-data', data });
      });
    });
  }
}
