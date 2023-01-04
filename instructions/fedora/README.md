# Setting up Fedora

## Goals

1. Secure NTP
2. Secure DNS
3. VPN
4. Dynamic swap

### 1. Secure NTP

1. Install-time: Time&Date - time.cloudflare.com, Pool, NTS
2. Do `timedatectl` and check output
3. Do `chronyc -N sources` and check output
4. Do `chronyc -N authdata` and check output

### 2. Secure DNS

1. Copy `files/etc/systemd/resolved.conf.d/dns.conf` to `/etc/systemd/resolved.conf.d/`
2. Copy `files/etc/NetworkManager/conf.d/dns.conf` to `/etc/NetworkManager/conf.d/`
3. Do `systemctl restart systemd-resolved`
4. Do `systemctl restart NetworkManager`
5. Do `resolvectl` and check output
6. Do `resolvectl query one.one.one.one` and check output
7. Visit [one.one.one.one/help](https://one.one.one.one/help)
8. Visit [dnsleaktest.com](https://dnsleaktest.com)

### 3. VPN

[Official WARP Desktop Client](https://one.one.one.one):

1. [Add repository](https://pkg.cloudflareclient.com/install)
2. [Fix repository version](https://community.cloudflare.com/t/setup-warp-in-fedora-34/277475)
3. [Install WARP](https://developers.cloudflare.com/warp-client/get-started/linux/)
4. If used `WireGuard`:
    1. Do `nmcli connection down wgcf-profile`
    2. Do `nmcli connection modify wgcf-profile connection.autoconnect no`
5. Do `warp-cli register`
6. Do `warp-cli connect`
7. Visit [one.one.one.one/help](https://one.one.one.one/help)
8. Visit [test-ipv6.com](https://test-ipv6.com)
9. If connection breaks:
    1. Copy `files/usr/local/bin/warpfix.sh` to `/usr/local/bin/`
    2. Copy `files/etc/systemd/system/warpfix.service` to `/etc/systemd/system/`
    3. Do `systemctl enable warpfix`
    4. Do `systemctl start warpfix`
    5. Do `systemctl status warpfix` and check output

WireGuard:

1. Download [wgcf](https://github.com/ViRb3/wgcf)
2. Do `wgcf register`
3. Do `wgcf generate`
4. If used `Official WARP Desktop Client`:
    1. Do `warp-cli disconnect`
5. Do `nmcli connection import type wireguard file ./wgcf-profile.conf`
6. Do `nmcli connection down wgcf-profile`
7. Do `systemctl restart NetworkManager`
8. Do `nmcli connection up wgcf-profile`
9. If not working - do reboot
10. If not working - change endpoint to IP from [WARP Ingress IP](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/deployment/firewall/#warp-ingress-ip)
11. Visit [one.one.one.one/help](https://one.one.one.one/help)
12. Visit [test-ipv6.com](https://test-ipv6.com)
13. If connection breaks:
    1. Copy `files/usr/local/bin/warpfix_wg.sh` to `/usr/local/bin/`
    2. Copy `files/etc/systemd/system/warpfix_wg.service` to `/etc/systemd/system/`
    3. Do `systemctl enable warpfix_wg`
    4. Do `systemctl start warpfix_wg`
    5. Do `systemctl status warpfix_wg` and check output

### 4. Dynamic swap

1. Download [swapspace](https://github.com/Tookmund/Swapspace)
2. Do `./configure`
3. Do `make`
4. Do `make install`
5. Do `swapspace` and check output
6. Do `cp swapspace.service /etc/systemd/system/`
7. Do `systemctl enable swapspace`
8. Do `systemctl start swapspace`
9. Do `systemctl status swapspace` and check output
10. Check the result by loading memory and swap
