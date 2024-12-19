import logger from './logger'
import { exit } from './methods/exit'
import { initialize } from './methods/initialize'
import { shutdown } from './methods/shutdown'
import { codeAction } from './methods/textDocument/code-action'
import { completion } from './methods/textDocument/completion'
import { diagnostic } from './methods/textDocument/diagnostic'
import { didChange } from './methods/textDocument/did-change'
import { didOpen } from './methods/textDocument/did-open'
import { hover } from './methods/textDocument/hover'

interface Message {
    jsonrpc: string
}

export interface NotificationMessage extends Message {
    method: string
    params?: unknown[] | object
}

export interface RequestMessage extends NotificationMessage {
    id: number | string
}

type RequestMethod = (
    message: RequestMessage
) =>
    | ReturnType<typeof initialize>
    | ReturnType<typeof completion>
    | ReturnType<typeof codeAction>
    | ReturnType<typeof diagnostic>
    | ReturnType<typeof hover>

type NotificationMethod = (message: NotificationMessage) => void

const methodLookup: Record<string, RequestMethod | NotificationMethod> = {
    exit,
    initialize,
    shutdown,
    'textDocument/completion': completion,
    'textDocument/didChange': didChange,
    'textDocument/didOpen': didOpen,
    'textDocument/diagnostic': diagnostic,
    'textDocument/codeAction': codeAction,
    'textDocument/hover': hover
}

const respond = (id: RequestMessage['id'], result: object | null) => {
    const message = JSON.stringify({ id, result })
    const messageLength = Buffer.byteLength(message, 'utf-8')
    const header = `Content-Length: ${messageLength}\r\n\r\n`

    logger.write(header + message)
    process.stdout.write(header + message)
}

let buffer = ''
process.stdin.on('data', (chunk) => {
    buffer += chunk
    while (true) {
        const lengthMatch = buffer.match(/Content-Length: (\d+)\r\n/)
        if (!lengthMatch) break

        const contentLength = Number.parseInt(lengthMatch[1], 10)
        const messageStart = buffer.indexOf('\r\n\r\n') + 4

        if (buffer.length < messageStart + contentLength) break

        const rawMessage = buffer.slice(messageStart, messageStart + contentLength)
        try {
            const message = JSON.parse(rawMessage)
            logger.write({ id: message.id, method: message.method })
            const method = methodLookup[message.method]
            if (method) {
                try {
                    const result = method(message)
                    if (result !== undefined) {
                        respond(message.id, result)
                    }
                } catch (err) {
                    logger.error(`respond.error.${method} ${err}`)
                }
            }
        } catch (err) {
            logger.error(`JSON.parse.error: ${err}`)
            logger.error(rawMessage)
        }
        // Remove the processed message from the buffer
        buffer = buffer.slice(messageStart + contentLength)
    }
})
