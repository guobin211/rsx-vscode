import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

// 日志级别
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

export class Logger {
    private logDir: string;
    private logFile: string;
    private level: LogLevel = LogLevel.INFO;
    private stream: fs.WriteStream | null = null;
    private outputChannel: vscode.OutputChannel | null = null;

    constructor() {
        this.logDir = path.join(os.homedir(), '.config', 'rsx-vscode');
        this.logFile = path.join(this.logDir, 'rsx-vscode.log');
    }

    setOutputChannel(channel: vscode.OutputChannel) {
        this.outputChannel = channel;
    }

    init(level: LogLevel = LogLevel.INFO) {
        this.level = level;
        try {
            if (!fs.existsSync(this.logDir)) {
                fs.mkdirSync(this.logDir, { recursive: true });
            }
            this.stream = fs.createWriteStream(this.logFile, { flags: 'a' });
            this.info('Logger initialized', { logFile: this.logFile });
        } catch (err) {
            console.error('Failed to initialize logger:', err);
            if (this.outputChannel) {
                this.outputChannel.appendLine(`Failed to initialize logger: ${err}`);
            }
        }
    }

    private write(level: string, message: string, data?: object) {
        const timestamp = new Date().toISOString();
        const logEntry = data
            ? `[${timestamp}] [${level}] ${message} ${JSON.stringify(data)}\n`
            : `[${timestamp}] [${level}] ${message}\n`;

        // 写入文件
        if (this.stream) {
            this.stream.write(logEntry);
        }

        // 同时输出到 VSCode 输出通道
        if (this.outputChannel) {
            this.outputChannel.appendLine(logEntry.trim());
        }

        // 开发模式下也输出到控制台
        console.log(logEntry.trim());
    }

    debug(message: string, data?: object) {
        if (this.level <= LogLevel.DEBUG) {
            this.write('DEBUG', message, data);
        }
    }

    info(message: string, data?: object) {
        if (this.level <= LogLevel.INFO) {
            this.write('INFO', message, data);
        }
    }

    warn(message: string, data?: object) {
        if (this.level <= LogLevel.WARN) {
            this.write('WARN', message, data);
        }
    }

    error(message: string, data?: object) {
        if (this.level <= LogLevel.ERROR) {
            this.write('ERROR', message, data);
        }
    }

    close() {
        if (this.stream) {
            this.stream.end();
            this.stream = null;
        }
    }
}

// 导出一个默认的 logger 实例
export const logger = new Logger();
