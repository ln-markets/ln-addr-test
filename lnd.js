const lnService = require('ln-service');

const config = {
  macaroon: process.env.LN_ADDR_SERVER_LND_MACAROON,
  tls: process.env.LN_ADDR_SERVER_LND_CERT,
  lnd_host: process.env.LN_ADDR_SERVER_LND_HOST,
  lnd_port: process.env.LN_ADDR_SERVER_LND_PORT
}

const { lnd } = lnService.authenticatedLndGrpc({
  cert: config.tls,
  macaroon: config.macaroon,
  socket: `${config.lnd_host}:${config.lnd_port}`,
})

module.exports = {
    lnd,
}