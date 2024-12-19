import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'

const getConfigDir = () => {
    const home = os.homedir()
    return path.join(home, '.config', 'rsx-analyzer')
}

const getLogFile = () => {
    return path.join(getConfigDir(), 'rsx-analyzer.log')
}

class FileLogger {
    logFile: string
    logStream: fs.WriteStream
    configDir: string

    constructor() {
        this.configDir = getConfigDir()
        this.logFile = getLogFile()
        fs.mkdirSync(this.configDir, { recursive: true })
        this.logStream = fs.createWriteStream(this.logFile, { flags: 'a' })
    }

    log(msg: string | object) {
        this.writeToFile(msg, 'LOG')
    }

    info(msg: string | object) {
        this.writeToFile(msg, 'INFO')
    }

    error(msg: string | object) {
        this.writeToFile(msg, 'ERROR')
    }

    write(msg: string | object) {
        if (typeof msg === 'object') {
            this.logStream.write(JSON.stringify(msg))
        } else {
            this.logStream.write(msg)
        }
        this.logStream.write('\n')
    }

    private writeToFile(msg: string | object, type: string) {
        if (msg && typeof msg === 'object') {
            this.logStream.write(`${type}: ${JSON.stringify(msg)}\n`)
        } else {
            this.logStream.write(`${type}: ${msg}\n`)
        }
    }
}

const logger = new FileLogger()

export default logger
