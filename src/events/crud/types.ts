import { IsString } from "class-validator";

export type DirectoryTreeType = {
    type: "file" | "directory";
    path: string;
    name: string;
}[]

export class BaseCrudEventType {
    @IsString()
    targetPath: string;
}

export class CreateFolderEventType extends BaseCrudEventType { }

export class CreateFileEventType extends BaseCrudEventType { }

export class ReadFolderEventType extends BaseCrudEventType { }

export class ReadFileEventType extends BaseCrudEventType { }

export class DeleteEventType extends BaseCrudEventType { }

export class MoveEventType extends BaseCrudEventType {
    @IsString()
    newPath: string;
}

export class UpdateFileEventType extends BaseCrudEventType {
    @IsString()
    fileContent: string
}

export type ReadFolderResponse = {
    targetPath: string
    folderContents: DirectoryTreeType
}

export type ReadFileResponse = {
    targetPath: string
    fileContent: string
}