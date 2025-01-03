import { Injectable } from '@nestjs/common';
import { TerminalService } from '../terminal/terminal.service';
import * as fs from 'fs';
import * as yaml from 'yaml';

@Injectable()
export class CommandService {
  private config;

  constructor(private terminalService: TerminalService) { }

  private loadConfig() {
    const configFile = '/home/arkad/code/arkad.yml';
    const configContent = fs.readFileSync(configFile, 'utf-8');
    this.config = yaml.parse(configContent);
  }

  async runCommand() {
    this.loadConfig();
    const cmd = this.config['CMD']['run'];
    return this.executeCommand(cmd);
  }

  async previewCommand() {
    this.loadConfig();
    const cmd = this.config['CMD']['preview'];
    return this.executeCommand(cmd);
  }

  getPreviewUrl() {
    this.loadConfig();
    return this.config['URL']['preview'] || 'http://localhost:1337/';
  }

  private async executeCommand(cmd: string): Promise<string> {
    console.log(`🚀 EXECUTING COMMAND: ${cmd}`);
    return new Promise((resolve, reject) => {
      try {
        this.terminalService.terminalProcess.write(`${cmd}\n`);
        resolve(`Command executed: ${cmd}`);
      } catch (error) {
        reject(`Error executing command: ${error.message}`);
      }
    });
  }
}
