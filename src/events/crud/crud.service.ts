import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CRUDHandler } from 'src/handlers/crudHandler';
import { CreateFileEventType, CreateFolderEventType, DeleteEventType, DirectoryTreeType, DownloadEventType, MoveEventType, ReadFileEventType, ReadFolderEventType, UpdateFileEventType } from './types';

@Injectable()
export class CRUDService {
    private codeDirectory: string;
    private userDirectory: string;

    constructor(
        private crudHandler: CRUDHandler,
        private configService: ConfigService
    ) {
        this.codeDirectory = this.configService.get('CODE_DIRECTORY')
        this.userDirectory = this.configService.get('USER_DIRECTORY')
    }

    checkIsPathLegal(path: string): boolean {
        return path.startsWith(this.codeDirectory) && !path.includes("../") && !path.includes("/root");
    }

    deleteResource(eventData: DeleteEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const resourcePath = eventData.targetPath;
            this.crudHandler.deleteResource(resourcePath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    moveResource(eventData: MoveEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const oldPath = eventData.targetPath;
            const newPath = eventData.newPath;
            this.crudHandler.moveResource(oldPath, newPath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    createFolder(eventData: CreateFolderEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const folderPath = eventData.targetPath;
            this.crudHandler.createFolder(folderPath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    createFile(eventData: CreateFileEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const filePath = eventData.targetPath;
            this.crudHandler.createFile(filePath, eventData.fileContent);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    readFolder(eventData: ReadFolderEventType): DirectoryTreeType {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const folderPath = eventData.targetPath;
            const tree = this.crudHandler.readFolder(folderPath);
            return tree
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    readFile(eventData: ReadFileEventType): string {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const filePath = eventData.targetPath;
            const content = this.crudHandler.readFile(filePath);
            return content
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    updateFile(eventData: UpdateFileEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const filePath = eventData.targetPath;
            this.crudHandler.updateFile(filePath, eventData.fileContent);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    async downloadWorkspace(eventData: DownloadEventType): Promise<Buffer> {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const folderPath = eventData.targetPath;
            return await this.crudHandler.compressFolder(folderPath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error resource not found');
        }
    }
}
