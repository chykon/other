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
  path=$(pwd)
  code --extensionDevelopmentPath="$path"
)

# # #

main "$@"
exit 0
