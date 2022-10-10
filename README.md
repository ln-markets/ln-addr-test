# ln-addr-test

Simple Express server for testing Lightning Addresses with a LN service. Conforms to the spec outlined at [lightning-address](https://github.com/andrerfneves/lightning-address/blob/master/README.md) for generating an LNURL pay object.

This a fork from [@blastshielddown](https://github.com/blastshielddown)"s work. The key differences, apart from some refactors, are:

- the use of [ln-service](https://github.com/alexbosworth/ln-service) to avoid dealing with grpc ourselves,
- Dockerfile to run the server in a Docker environment.

Configured to run with an LND backend. Requires the passing of environment variables with the following values:

| Variable | Description |
|----------|-------------|
|        LND_MACAROON  |       LND admin macaroon in base64      |
|      LND_CERT    |        LND TLS cert in base64     |
|     LND_HOST     |       LND Host      |
|     LND_PORT     |      LND Port (default to 10009)       |
|     APP_PORT     |       App port (default to 3000)      |
|     CALLBACK_HOST     |         Host for the url callback (default to localhost)    |

## Usage

### Bare metal

```bash
pnpm install && pnpm start
```

Example:

```sh
curl http://127.0.0.1:3000/.well-known/lnurlp/testman
```

```json
{
    "tag": "payRequest",
    "callback": "http://localhost:3000/payment-request/id-1234",
    "maxSendable": 100000000000,
    "minSendable": 1000,
    "metadata": "[['text/plain','Hello World!'']]",
}
```

```sh
curl http://localhost:3000/payment-request/id-1234?amount=10000
```

```json
{
    "pr": "<Lightning BOLT 11 invoice>",
}
```

### Docker

Build the image using the Dockerfile.
