import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { execSync } from 'child_process';
import { IPty, spawn as spawnNodePty } from "node-pty";
import { existsSync, readFileSync } from 'fs';
import { EOL } from 'os';
import { Observable, Observer } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import ConfigParser from 'configparser';
import { bright, red, reset, BgWhite, green, blue, arkadLogo, LS_COLORS } from 'src/constants';

@WebSocketGateway()
export class TerminalGateway {
    private terminalProcess: IPty
    private hostname: string;
    private codeDirectory: string;
    private userDirectory: string;

    constructor(private configService: ConfigService) {
        this.hostname = this.configService.get('HOSTNAME');
        this.codeDirectory = this.configService.get('CODE_DIRECTORY');
        this.userDirectory = this.configService.get('USER_DIRECTORY');
        this.terminalProcess = spawnNodePty("bash", [], {
            name: "xterm-color",
            cwd: this.codeDirectory,
            uid: existsSync(`/home/arkad/.uid`) ? parseInt(readFileSync("/home/arkad/.uid", "utf-8")) : parseInt(execSync(`id -u`).toString()),
            gid: existsSync(`/home/arkad/.gid`) ? parseInt(readFileSync("/home/arkad/.gid", "utf-8")) : parseInt(execSync(`id -g`).toString()),
            env: {
                CommunicationPort: this.configService.get('COMMUNICATION_PORT'),
                PreviewPort: this.configService.get('PREVIEW_PORT_1'),
                PreviewPort2: this.configService.get('PREVIEW_PORT_2'),
                HOSTNAME: this.configService.get('HOSTNAME'),
                SHELL: `/bin/bash`,
                PWD: this.userDirectory,
                LOGNAME: `arkad`,
                HOME: this.userDirectory,
                TERM: `xterm`,
                USER: `arkad`,
                SHLVL: `2`,
                PATH: `/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin`,
                MAIL: `/var/mail/arkad`,
                _: `/usr/bin/env`,
                LS_COLORS: LS_COLORS,
            },
        });
        this.terminalProcess.write(`clear${EOL}`);
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('terminal-input')
    async inputTerminal(@MessageBody() eventData: string) {
        console.log("START TERMINAL INPUT");
        this.terminalProcess.write(eventData + EOL);
    }

    @SubscribeMessage('terminal-preview')
    async startPreview(@MessageBody() eventData: string) {
        try {
            const configParser = new ConfigParser()
            configParser.read(`${this.codeDirectory}/arkad.cfg`)

            this.terminalProcess.write(`${configParser.get("Preview", "startPreviewCommand") || ""}${EOL}`)
        } catch (error) {
            console.log(error)
        }
    }

    @SubscribeMessage('terminal')
    initConnexion(@ConnectedSocket() client: Socket): Observable<WsResponse<string>> {
        console.log("START TERMINAL");
        return new Observable((observer: Observer<WsResponse<string>>) => {
            console.log("START TERMINAL OBSERVABLE");

            client.emit('terminal-data', {
                data: `${bright}${red}${arkadLogo}${reset}${EOL}`,
            });

            client.emit('terminal-data', {
                data: `${BgWhite}${bright}${red}Connected! Welcome to arkad!${reset}${EOL}${EOL}`
            });

            client.emit('terminal-data', { data: `${bright}${green}arkad@${this.hostname.split(".")[0]}${reset}:${bright}${blue}~/code${reset}$ ` });

            this.terminalProcess.onData(data => {
                console.log("START TERMINAL DATA");
                observer.next({ event: 'terminal-data', data })
            })
        });
    }
}
