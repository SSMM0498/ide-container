import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CRUDService } from './crud.service';
import { CreateFileEventType, CreateFolderEventType, DeleteEventType, MoveEventType, ReadFileEventType, ReadFileResponse, ReadFolderEventType, ReadFolderResponse, UpdateFileEventType } from './types';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CRUDGateway {
    constructor(private crudService: CRUDService) { }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('init')
    initConnexion() {
        console.log('INIT');
    }

    @SubscribeMessage('crud-delete-resource')
    async onDeleteResource(@MessageBody() eventData: DeleteEventType) {
        console.log('DELETE RESOURCE - CRUD DATA : ' + eventData);
        this.crudService.deleteResource(eventData);
    }

    @SubscribeMessage('crud-move-resource')
    async onMoveResource(@MessageBody() eventData: MoveEventType) {
        console.log('MOVE RESOURCE - CRUD DATA : ' + eventData);
        this.crudService.moveResource(eventData);
    }

    @SubscribeMessage('crud-create-folder')
    async onCreateFolder(@MessageBody() eventData: CreateFolderEventType) {
        console.log('CREATE FOLDER - CRUD DATA : ' + eventData);
        this.crudService.createFolder(eventData);
    }

    @SubscribeMessage('crud-create-file')
    async onCreateFile(@MessageBody() eventData: CreateFileEventType) {
        console.log('CREATE FILE - CRUD DATA : ' + eventData);
        this.crudService.createFile(eventData);
    }

    @SubscribeMessage('crud-read-folder')
    async onReadFolder(@MessageBody() eventData: ReadFolderEventType): Promise<WsResponse<ReadFolderResponse>> {
        console.log('READ FOLDER - CRUD DATA : ' + eventData);
        const tree = this.crudService.readFolder(eventData)
        return {
            event: 'read-folder',
            data: {
                targetPath: eventData.targetPath,
                folderContents: tree
            }
        };
    }

    @SubscribeMessage('crud-read-file')
    async onReadFile(@MessageBody() eventData: ReadFileEventType): Promise<WsResponse<ReadFileResponse>> {
        console.log('READ FILE - CRUD DATA : ' + eventData);
        const content = this.crudService.readFile(eventData)
        return {
            event: 'read-file',
            data: {
                targetPath: eventData.targetPath,
                fileContent: content
            }
        };
    }

    @SubscribeMessage('crud-update-file')
    async onUpdateFile(@MessageBody() eventData: UpdateFileEventType) {
        console.log('UPDATE FILE - CRUD DATA : ' + eventData);
        this.crudService.updateFile(eventData)
    }
}