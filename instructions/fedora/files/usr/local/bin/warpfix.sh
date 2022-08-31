#!/bin/sh

switch=0
while true; do
  if ! timeout 1 ping -4 -c 1 one.one.one.one; then
    if [ "$switch" -eq 0 ]; then
      echo 'switch:0'
      warp-cli set-gateway 0
      switch=1
    else
      echo 'switch:1'
      warp-cli clear-gateway
      switch=0
    fi
  fi
  sleep 1
done
