#!/usr/bin/env bash

# Note that this script requires following NPM modules
# - testrpc-sc OR ethereumjs-testrpc-sc
# - ganache-cli
# - solidity-coverage
# - coveralls
# - truffle

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

# Check one of the modules is installed
require_any_module() {
  installed=false
  for md in "$@"
  do
    if [ -e node_modules/.bin/$md ]; then
      echo "✅ Checked $md is installed"
      installed=true
    fi
  done

  if [ "$#" -eq 1 ] && [ "$installed" = false ]; then
    echo '😱 Error: Module `'$1'` is not installed.' >&2
    exit 1
  elif [ "$installed" = false ]; then
    echo '😱 Error: None of modules are installed. Install one of the modules following' >&2
    for md in "$@"
    do
      echo "- $md"
    done
    exit 1
  fi
}

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}

if [ "$SOLIDITY_COVERAGE" = true ]; then
  ganache_port=8555
else
  ganache_port=8545
fi

ganache_running() {
  nc -z localhost "$ganache_port"
}

start_ganache() {
  local accounts=(
    --account="0xa5e6473343d8d6fe4d19317edc764191eadd0621a580855013392548f29a542c,1000000000000000000000000"
    --account="0x7701ad06e40a61b4d8f4af2d674065593d785ea078c8ccef7c4e9be0d9fb2181,1000000000000000000000000"
    --account="0xe57569554633760d0a2ac6e76c78775cbbb3e8a2fda4fa7edf42087fa126eaa0,1000000000000000000000000"
    --account="0xc16e553218c5d9e5ae619dd85d4066c9c8a1e1787cb625f83617ea9a330a8c32,1000000000000000000000000"
    --account="0x0d6d617c06b3161c0976cf36b0381c6ade0b138453aaae232d5817d0dfe9d268,1000000000000000000000000"
  )

  if [ "$SOLIDITY_COVERAGE" = true ]; then
    require_any_module testrpc-sc ethereumjs-testrpc-sc
    if [ -e node_modules/.bin/testrpc-sc ]; then
      # If you installed using npm
      echo "ℹ️ testrpc-sc"
      node_modules/.bin/testrpc-sc --gasLimit 0xfffffffffff --port "$ganache_port" "${accounts[@]}" > /dev/null &
    else
      # If you installed using yarn
      echo "ℹ️ ethereumjs-testrpc-sc"
      node_modules/ethereumjs-testrpc-sc/build/cli.node.js  --gasLimit 0xfffffffffff --port "$ganache_port"  "${accounts[@]}" > /dev/null &
    fi
  else
    require_any_module ganache-cli
    node_modules/.bin/ganache-cli --gasLimit 0xfffffffffff  > /dev/null &
  fi
  ganache_pid=$!
}

if ganache_running; then
  echo "♻️ Using existing ganache instance"
else
  echo "❇️ Starting our own ganache instance"
  start_ganache
fi

if [ "$SOLC_NIGHTLY" = true ]; then
  echo "⬇️ Downloading solc nightly"
  wget -q https://raw.githubusercontent.com/ethereum/solc-bin/gh-pages/bin/soljson-nightly.js -O /tmp/soljson.js && find . -name soljson.js -exec cp /tmp/soljson.js {} \;
fi

if [ "$SOLIDITY_COVERAGE" = true ]; then
  # require_any_module solidity-coverage
  node_modules/.bin/solidity-coverage

  if [ "$CONTINUOUS_INTEGRATION" = true ]; then
    require_any_module coveralls
    cat coverage/lcov.info | node_modules/.bin/coveralls
  fi
else
  require_any_module truffle
  node_modules/.bin/truffle test --reset --network rpc "$@"
fi
