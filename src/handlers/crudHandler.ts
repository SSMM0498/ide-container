import { Injectable } from "@nestjs/common";
import { ChildProcessWithoutNullStreams, spawn as spawnChildProcess } from "child_process"
import * as directoryTree from "directory-tree";
import { readFileSync, writeFileSync, createWriteStream } from "fs";
import { writeFile } from "fs/promises";
import { DirectoryTreeType } from "src/events/crud/types";
import * as archiver from 'archiver';
import { join, dirname } from 'path';

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

    async createFile(filePath: string, fileContent?: string | ArrayBuffer) {
        const child = spawnChildProcess("touch", [filePath]);
        await new Promise((resolve) => {
            child.on('exit', resolve);
        });

        if (fileContent !== undefined) {
            await this.updateFile(filePath, fileContent);
        }
    }

    async updateFile(filePath: string, fileContent: string | ArrayBuffer) {
        if (fileContent instanceof ArrayBuffer) {
            await writeFile(filePath, Buffer.from(fileContent));
        } else {
            writeFileSync(filePath, fileContent);
        }
    }

    async compressFolder(folderPath: string): Promise<Buffer> {
        const parentDir = dirname(folderPath);
        const folderName = folderPath.split('/').pop();
        const zipPath = join(parentDir, `${folderName}.zip`);
        const output = createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        return new Promise((resolve, reject) => {
            output.on('close', () => {
                const zipContent = readFileSync(zipPath);
                // Clean up temp zip file
                this.deleteResource(zipPath);
                resolve(zipContent);
            });

            archive.on('error', (err) => reject(err));
            archive.pipe(output);
            archive.directory(folderPath, false);
            archive.finalize();
        });
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