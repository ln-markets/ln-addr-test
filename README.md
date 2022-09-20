### ln-addr-test

Simple Express server for testing Lightning Addresses with a LN service. Conforms to the spec outlined at [lightning-address](https://github.com/andrerfneves/lightning-address/blob/master/README.md) for generating an LNURL pay object.

This a fork from [@blastshielddown](https://github.com/blastshielddown)'s work. The key differences, apart from some refactors, are:
- the use of [ln-service](https://github.com/alexbosworth/ln-service) to avoid dealing with grpc ourselves,
- Dockerfile to run the server in a Docker environment.

Configured to run with an LND backend. Requires the passing of environment variables with the following values:
```
LN_ADDR_SERVER_LND_MACAROON=<macaroon>
LN_ADDR_SERVER_LND_CERT=<tls cert>
LN_ADDR_SERVER_LND_HOST=<host>
LN_ADDR_SERVER_LND_PORT=<part>
```

## Usage

### "Bare metal"

Setup:
`npm install`

To run:
`npm start`

Example:
lnurlp endpoint:

```sh
curl http://127.0.0.1:3003/.well-known/lnurlp/testman
```
Returns:
`{"tag":"payRequest","callback":"http://127.0.0.1:3003/payment-request/id-1234"}`

lnurl payment request:

```sh
curl http://127.0.0.1:3003/payment-request/id-1234\?amount\=10000
```
Returns lnurl pr

### Docker

Build the image using the Dockerfile.
