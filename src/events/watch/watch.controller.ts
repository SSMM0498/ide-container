import { Controller, Get, Sse } from '@nestjs/common';
import { watch as chokidarWatch } from "chokidar"
import { interval, map, Observable, Observer } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface MessageEvent {
    data: string | object;
    id?: string;
    type?: string;
    retry?: number;
}

@Controller('api')
export class WatchController {
    private codeDirectory: string;
    private ignoredDirectories = ["node_modules", ".git"];

    constructor(
        private configService: ConfigService
    ) {
        this.codeDirectory = this.configService.get('CODE_DIRECTORY')
    }

    @Sse('watch')
    startWatching(): Observable<MessageEvent> {
        return new Observable((observer: Observer<MessageEvent>) => {
            console.log("START WATCHING FROM HANDLER");

            const watcher = chokidarWatch(
                this.codeDirectory, {
                ignoreInitial: true,
                ignored: this.isMatchWithAnIgnoredDirectory(),
            });

            watcher.on('ready', () => {
                console.log("I am ready to watch files");
            });

            ['add', 'addDir', 'change', 'unlink', 'unlinkDir'].forEach((event: "add" | "addDir" | "change" | "unlink" | "unlinkDir") => {
                watcher.on(event, (path) => setTimeout(() => {
                    observer.next({ data: { type: event, data: path } })
                }, 0));
            });

            watcher.on('error', error => {
                console.log(error);
            });
        });
    }

    private isMatchWithAnIgnoredDirectory() {
        return filePath => this.ignoredDirectories.some(ignoredDir => filePath.includes(ignoredDir));
    }
}
