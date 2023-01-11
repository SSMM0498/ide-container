import { Injectable } from "@nestjs/common";
import { ChildProcessWithoutNullStreams, spawn as spawnChildProcess } from "child_process"
import * as directoryTree from "directory-tree";
import { readFileSync, writeFileSync } from "fs";
import { DirectoryTreeType } from "src/events/crud/types";

@Injectable()
export class CRUDHandler {
    moveResource(oldPath: string, newPath: string) {
        spawnChildProcess("mv", ["-f", oldPath, newPath])
    }

    deleteResource(resourcePath: string) {
        spawnChildProcess("rm", ["-rf", resourcePath])
    }

    readFile(filePath: string): string {
        return readFileSync(filePath, "utf8")
    }

    readFolder(folderPath: string): DirectoryTreeType {
        const tree = directoryTree(folderPath, { attributes: ["type"] });
        return (tree?.children || [])?.map(({ type, path, name }) => ({ type, path, name }))
    }
    createFolder(folderPath: string) {
        const child = spawnChildProcess("mkdir", [folderPath]);
        this.onProcessOver(child);
    }

    createFile(filePath: string) {
        const child = spawnChildProcess("touch", [filePath]);
        this.onProcessOver(child);
    }

    updateFile(filePath: string, fileContent: string) {
        writeFileSync(filePath, fileContent)
    }

    private onProcessOver(child: ChildProcessWithoutNullStreams) {
        child.stdout.on('data', (data) => console.log(`stdout: ${data}`));

        child.stderr.on('data', (data) => console.log(`stderr: ${data}`));

        child.on('error', (error) => console.log(`error: ${error.message}`));

        child.on('exit', (code, signal) => {
            if (code)
                console.log(`Process exit with code: ${code}`);
            if (signal)
                console.log(`Process killed with signal: ${signal}`);
            console.log(`Done ✅`);
        });
    }
}