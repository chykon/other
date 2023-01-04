#!/bin/bash

while true; do
  if ! timeout 1 ping -4 -c 1 one.one.one.one; then
    echo 'restart'
    nmcli connection up wgcf-profile
  fi
  sleep 1
done
