import { createConnection, createServer, createSimpleProject } from '@volar/language-server/node'
import { create as createCssService } from 'volar-service-css'
import { create as createHtmlService } from 'volar-service-html'
import { plugin } from './plugin'

const connection = createConnection()
const server = createServer(connection)

connection.listen()

connection.onInitialize((params) => {
    return server.initialize(params, createSimpleProject([plugin]), [
        createHtmlService(),
        createCssService()
    ])
})

connection.onInitialized(server.initialized)
connection.onShutdown(server.shutdown)
