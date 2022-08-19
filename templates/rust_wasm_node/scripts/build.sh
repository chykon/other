#!/bin/sh

__final() (
  :
)
__init() {
  set -eu
  trap __final EXIT
}
__init

# # #

main() (
  # --target web
  wasm-pack build --target nodejs --dev --out-dir build/rust/pkg
  mkdir -p web/rust
  cp build/rust/pkg/rivium_bg.wasm web/rust
  cp build/rust/pkg/rivium.js web/rust
)

# # #

main "$@"
exit 0
