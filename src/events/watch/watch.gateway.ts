import { Controller, Get, Sse } from '@nestjs/common';
import { FSWatcher, watch as chokidarWatch } from "chokidar"
import { interval, map, Observable, Observer } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';

interface MessageEvent {
    data: string | object;
    id?: string;
    type?: string;
    retry?: number;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class WatchGateway {
    private watcher: FSWatcher;

    constructor(
        private configService: ConfigService
    ) {
        const codeDirectory = this.configService.get('CODE_DIRECTORY');
        this.watcher = chokidarWatch(
            codeDirectory, {
            ignoreInitial: true,
            ignored: this.isMatchWithAnIgnoredDirectory(),
        });
        this.watcher.on('ready', () => {
            console.log("I am ready to watch files");
        });
        this.watcher.on('error', error => {
            console.log(error);
        });
    }

    @SubscribeMessage('watch')
    startWatching(): Observable<WsResponse<string>> {
        return new Observable((observer: Observer<WsResponse<string>>) => {
            console.log("START WATCHING FROM HANDLER");

            ['add', 'addDir', 'change', 'unlink', 'unlinkDir'].forEach((event: "add" | "addDir" | "change" | "unlink" | "unlinkDir") => {
                this.watcher.on(event, (path) => setTimeout(() => {
                    console.log("TRIGGER ", event, " ", path);
                    observer.next({ event: event as string, data: path })
                }, 0));
            });
        });
    }

    private isMatchWithAnIgnoredDirectory() {
        const ignoredDirectories = ["node_modules", ".git"]
        return filePath => ignoredDirectories.some(ignoredDir => filePath.includes(ignoredDir));
    }
}
