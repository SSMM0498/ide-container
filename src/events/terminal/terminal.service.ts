import { Injectable } from '@nestjs/common';
import { IPty, spawn as spawnNodePty } from 'node-pty';
import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { EOL } from 'os';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TerminalService {
  private terminals: Map<string, IPty> = new Map();
  public hostname: string;
  private codeDirectory: string;
  private userDirectory: string;

  constructor(private configService: ConfigService) {
    this.hostname = this.configService.get('HOSTNAME');
    this.codeDirectory = this.configService.get('CODE_DIRECTORY');
    this.userDirectory = this.configService.get('USER_DIRECTORY');
  }

  createTerminal(id: string): IPty {
    const terminalProcess = spawnNodePty('bash', [], {
      name: 'xterm-color',
      cwd: this.codeDirectory,
      uid: existsSync(`${this.codeDirectory}.uid`) ? parseInt(readFileSync(`${this.codeDirectory}.uid`, 'utf-8')) : parseInt(execSync(`id -u`).toString()),
      gid: existsSync(`${this.codeDirectory}.gid`) ? parseInt(readFileSync(`${this.codeDirectory}.gid`, 'utf-8')) : parseInt(execSync(`id -g`).toString()),
      env: {
        COMMUNICATION_PORT: this.configService.get('COMMUNICATION_PORT'),
        PREVIEW_PORT_1: this.configService.get('PREVIEW_PORT_1'),
        PREVIEW_PORT_2: this.configService.get('PREVIEW_PORT_2'),
        HOSTNAME: this.configService.get('HOSTNAME'),
        SHELL: '/bin/bash',
        PWD: this.userDirectory,
        LOGNAME: 'arkad',
        HOME: this.userDirectory,
        TERM: 'xterm',
        USER: 'arkad',
        SHLVL: '2',
        PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin',
        MAIL: '/var/mail/arkad',
        _: '/usr/bin/env',
        LS_COLORS: this.configService.get('LS_COLORS'),
      },
    });
    terminalProcess.write(`clear${EOL}`);
    this.terminals.set(id, terminalProcess);
    return terminalProcess;
  }

  getTerminal(id: string): IPty {
    return this.terminals.get(id);
  }

  closeTerminal(id: string): void {
    const terminal = this.terminals.get(id);
    if (terminal) {
      terminal.kill();
      this.terminals.delete(id);
    }
  }
}
