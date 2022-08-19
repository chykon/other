# Setting up Fedora

## Goals

1. Secure NTP
2. Secure DNS
3. VPN
4. Dynamic swap

### 1. Secure NTP

* TODO: Risk of being able to obtain NTP servers via DHCP
* TODO: Script for check

1. Install-time: Time&Date - time.cloudflare.com, Pool, NTS
2. Do `timedatectl` and check output
3. Do `chronyc -N sources` and check output
4. Do `chronyc -N authdata` and check output

### 2. Secure DNS

* TODO: Script for automation
* TODO: Script for check

1. Copy `files/etc/systemd/resolved.conf.d/dns.conf` to `etc/systemd/resolved.conf.d/dns.conf`
2. Copy `files/etc/NetworkManager/conf.d/dns.conf` to `etc/NetworkManager/conf.d/dns.conf`
3. Do `systemctl restart systemd-resolved`
4. Do `systemctl restart NetworkManager`
5. Do `resolvectl` and check output
6. Do `resolvectl query one.one.one.one` and check output
7. Visit `one.one.one.one/help`
8. Visit `dnsleaktest.com`

### 3. VPN

* TODO: Switch to "Official WARP Desktop Client" when it becomes stable
* TODO: Script for automation
* TODO: Script for check
* TODO: Add links

1. Download `wgcf`
2. Do `wgcf register`
3. Do `wgcf generate`
4. Do `nmcli connection import type wireguard file ./wgcf-profile.conf`
5. If not working - change endpoint to IP from `WARP Ingress IP`
6. Visit `one.one.one.one/help`
7. Visit `test-ipv6.com`

### 4. Dynamic swap

* TODO: Script for automation
* TODO: Script for check
* TODO: Add links

1. Download `swapspace`
2. Do `./configure`
3. Do `make`
4. Do `make install`
5. Do `cp swapspace.service /etc/systemd/system/`
6. Do `systemctl enable swapspace`
7. Do `systemctl start swapspace`
8. Check the result by loading memory and swap