# BO6 Token

## Introduction
...

## Development

#### Set environement variables
```bash
MNEMONIC= # mnemonic for HD wallet
INFURA_API_KEY= # https://infura.io/register
SOLIDITY_COVERAGE= # true or false 
GAS_REPORTER= # true or false 
```

#### Test
```bash
# test smart contracts
npm run test 

# test coverage
npm run coverage # generate coverage reports
open coverage/index.html # open reports
```

#### Deploy
```bash
# deploy to development network
npm run migrate:dev
```
