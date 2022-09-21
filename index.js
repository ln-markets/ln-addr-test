const express = require('express')
const app = express()
const host = "172.81.0.113"
const port = 3003
const { lnd } = require('./lnd.js')
const lnService = require('ln-service')

const MAX_SENDABLE = 100_000_000_000
const MIN_SENDABLE = 1000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/.well-known/lnurlp/:username', (req, res) => {
    res.json({ tag: 'payRequest', callback: `http://${host}:${port}/payment-request/id-1234`, maxSendable: MAX_SENDABLE, minSendable: MIN_SENDABLE, metadata: '[[\"text/plain\",\"Hello World!\"]]'})

  })

app.get('/payment-request/id-1234', async (req, res) => {
  try {
    const amount = req.query.amount
    const request = {
        mtokens: amount,
        description: `test invoice`,
        expiry: 180
      };
  
    console.log(request);
  
    // Generate invoice
    const { request: pr } = await lnService.createInvoice({ ...request, lnd })
    res.json({pr})
  } catch(error) {
    console.error(error)
  }


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})