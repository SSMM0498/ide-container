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
    constructor(private terminalService: TerminalService) { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('create-terminal')
    handleCreateTerminal(@MessageBody() id: string): Observable<WsResponse<{ id: string, content: string }>> {
        console.log('🖥️ START TERMINAL', id);
        const terminal = this.terminalService.createTerminal(id);

        return new Observable((observer: Observer<WsResponse<{ id: string, content: string }>>) => {
            console.log('👀 START TERMINAL OBSERVABLE');

            observer.next({
                event: 'terminal-data',
                data: { id, content: `${bright}${blue}${arkadLogo}${reset}${EOL}` }
            });

            observer.next({
                event: 'terminal-data',
                data: { id, content: `${BgWhite}${bright}${blue}Connected! Welcome to arkad!${reset}${EOL}${EOL}` }
            });

            observer.next({
                event: 'terminal-data',
                data: { id, content: `${bright}${green}arkad@${this.terminalService.hostname.split('.')[0]}${reset}:${bright}${blue}~/code${reset}$ ` }
            });

            terminal.onData((data) => {
                console.log('📥 START TERMINAL DATA');
                observer.next({
                    event: 'terminal-data',
                    data: { id, content: data }
                });
            });
        });
    }

    @SubscribeMessage('close-terminal')
    handleCloseTerminal(@MessageBody() id: string) {
        this.terminalService.closeTerminal(id);
        return { event: 'terminal-closed', data: { id } };
    }

    @SubscribeMessage('terminal-input')
    async inputTerminal(@MessageBody() { id, input }: { id: string, input: string }) {
        console.log('⌨️ START TERMINAL INPUT');
        const terminal = this.terminalService.getTerminal(id);
        if (terminal) {
            terminal.write(input);
        }
    }
}
