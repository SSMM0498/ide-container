import { FSWatcher, watch as chokidarWatch } from "chokidar"
import { Observable, Observer } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';

export function debounce<T extends Function>(cb: T, wait = 1000) {
    let h: NodeJS.Timeout | null = null;
    let callable = (...args: any) => {
        clearTimeout(h as NodeJS.Timeout);
        h = setTimeout(() => cb(...args), wait);
    };
    return <T>(<any>callable);
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
            usePolling: false,
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
            this.watcher.on('all', debounce((event, path) => {
                console.log("TRIGGER ", event, " ", path);
                observer.next({ event: event as string, data: path })
            }));
        });
    }

    private isMatchWithAnIgnoredDirectory() {
        const ignoredDirectories = ["node_modules", ".git"]
        return filePath => ignoredDirectories.some(ignoredDir => filePath.includes(ignoredDir));
    }
}
