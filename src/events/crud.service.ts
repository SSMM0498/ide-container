import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CRUDHandler } from 'src/handlers/crudHandler';
import { CreateFileEventType, CreateFolderEventType, DeleteEventType, DirectoryTreeType, MoveEventType, ReadFileEventType, ReadFolderEventType, UpdateFileEventType } from './types';

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
        return path.startsWith(this.codeDirectory) && !path.includes("../") && !path.includes("/root")
    }

    deleteResource(eventData: DeleteEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const resourcePath = eventData.targetPath.substring(this.userDirectory.length);
            this.crudHandler.deleteResource(resourcePath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    moveResource(eventData: MoveEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const oldPath = eventData.targetPath.substring(this.userDirectory.length);
            const newPath = eventData.newPath.substring(this.userDirectory.length);
            this.crudHandler.moveResource(oldPath, newPath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    createFolder(eventData: CreateFolderEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const folderPath = eventData.targetPath.substring(this.userDirectory.length);
            this.crudHandler.createFolder(folderPath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    createFile(eventData: CreateFileEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const filePath = eventData.targetPath.substring(this.userDirectory.length);
            this.crudHandler.createFile(filePath);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    readFolder(eventData: ReadFolderEventType): DirectoryTreeType {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const folderPath = eventData.targetPath.substring(this.userDirectory.length);
            const tree = this.crudHandler.readFolder(folderPath);
            return tree
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    readFile(eventData: ReadFileEventType): string {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const filePath = eventData.targetPath.substring(this.userDirectory.length);
            const content = this.crudHandler.readFile(filePath);
            return content
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }

    updateFile(eventData: UpdateFileEventType) {
        if (this.checkIsPathLegal(eventData.targetPath)) {
            const filePath = eventData.targetPath.substring(this.userDirectory.length);
            this.crudHandler.updateFile(filePath, eventData.fileContent);
        } else {
            //  TODO: Handle correctly this error
            console.log('Error ressource not found');
        }
    }
}
