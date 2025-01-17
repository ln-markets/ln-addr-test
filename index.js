import process from 'node:process'
import express from 'express'
import { createInvoice, authenticatedLndGrpc, getWalletInfo } from 'ln-service'
import dotenv from 'dotenv'

dotenv.config()

const callbackHost = process.env.LN_ADDR_TEST_CALLBACK_HOST || 'localhost'
const port = process.env.LN_ADDR_TEST_PORT || 7777

const app = express()

const { lnd } = authenticatedLndGrpc({
  cert: process.env.LN_ADDR_TEST_LND_CERT,
  macaroon: process.env.LN_ADDR_TEST_LND_MACAROON,
  socket: `${process.env.LN_ADDR_TEST_LND_HOST}:${process.env.LN_ADDR_TEST_LND_PORT || 10009}`,
})

const info = await getWalletInfo({ lnd })

console.log(`Connected to ${info.alias} (${info.public_key})`)

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/.well-known/lnurlp/:username', (request, response) => {
  const host = request.ip === '127.0.0.1' ? '127.0.0.1' : callbackHost
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Lightning address test server  listening on 0.0.0.0:${port}`)
})
