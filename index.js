import process from 'node:process'
import express from 'express'
import { createInvoice, authenticatedLndGrpc } from 'ln-service'
import dotenv from 'dotenv'

dotenv.config()

const host = process.APP_HOST || 'localhost'
const port = process.env.APP_PORT || 3000

const app = express()

const { lnd } = authenticatedLndGrpc({
  cert: process.env.LND_CERT,
  macaroon: process.env.LND_MACAROON,
  socket: `${process.env.LND_HOST}:${process.env.LND_PORT || 10009}`,
})

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/.well-known/lnurlp/:username', (request, response) => {
  response.json({
    tag: 'payRequest',
    callback: `http://${host}:${port}/payment-request/id-1234`,
    maxSendable: 100_000_000_000,
    minSendable: 1000,
    metadata: '[["text/plain","Hello World!"]]',
  })
})

app.get('/payment-request/id-1234', async (request, response, next) => {
  try {
    console.log(request.query)
    const { request: pr } = await createInvoice({
      mtokens: request.query.amount,
      description: `test invoice`,
      expiry: 180,
      lnd,
    })

    response.json({ pr })
  } catch (error) {
    next(error)
  }
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error })
})

app.listen(port, host, () => {
  console.log(`Lightning address test server  listening on ${host}:${port}`)
})
