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

* TODO: Use Node instead Shell
* TODO: Script for automation
* TODO: Script for check
* TODO: Add links

Official WARP Desktop Client:

1. Add repository
2. Fix repository version
3. Install WARP
4. If used `WireGuard`
    1. Do `nmcli con down wgcf-profile`
    2. Do `nmcli con mod wgcf-profile connection.autoconnect no`
5. Do `warp-cli register`
6. Do `warp-cli connect`
7. Visit `one.one.one.one/help`
8. Visit `test-ipv6.com`
9. If connection breaks
    1. Copy `files/usr/local/bin/warpfix.sh` to `/usr/local/bin/warpfix.sh`
    2. Do `systemctl enable warpfix`
    3. Do `systemctl start warpfix`
    4. Do `systemctl status warpfix` and check output

WireGuard:

1. Download `wgcf`
2. Do `wgcf register`
3. Do `wgcf generate`
4. Do `nmcli connection import type wireguard file ./wgcf-profile.conf`
5. Do `nmcli con down wgcf-profile`
6. Do `systemctl restart NetworkManager`
7. Do `nmcli con up wgcf-profile`
8. If not working - do reboot
9. If not working - change endpoint to IP from `WARP Ingress IP`
10. Visit `one.one.one.one/help`
11. Visit `test-ipv6.com`

### 4. Dynamic swap

* TODO: Script for automation
* TODO: Script for check
* TODO: Add links

1. Download `swapspace`
2. Do `./configure`
3. Do `make`
4. Do `make install`
5. Do `swapspace` and check output
6. Do `cp swapspace.service /etc/systemd/system/`
7. Do `systemctl enable swapspace`
8. Do `systemctl start swapspace`
9. Do `systemctl | grep swapspace` and check output
10. Check the result by loading memory and swap
