// TODO: Logging
// TODO: HTTP/3

import * as http from 'node:http'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import puppeteer from 'puppeteer'
import { WebSocketServer } from 'ws'

// TODO: Use client response on page instead evaluate
async function getPermissionsPolicyListFromChromium () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('about:blank')
  // @ts-ignore
  const permissionsPolicyList = await page.evaluate(() => document.featurePolicy.features())
  await browser.close()
  return permissionsPolicyList
}

/**
 * @param {string[]} list
 */
function preparePermissionsPolicyList (list) {
  let str = ''
  for (const value of list) {
    str += value + '=(),'
  }
  return str.slice(0, str.length - 1)
}

// TODO: Test headers in response
/**
 * @param {http.ServerResponse} response
 * @param {string} permissionsPolicyString
 */
function setDefaultHeaders (response, permissionsPolicyString) {
  response.setHeader('strict-transport-security',
    'max-age=31536000;' +
    'includesubdomains;' +
    'preload'
  )
  response.setHeader('cache-control', 'no-store')
  response.setHeader('cross-origin-embedder-policy', 'require-corp')
  response.setHeader('cross-origin-resource-policy', 'same-origin')
  response.setHeader('cross-origin-opener-policy', 'same-origin')
  response.setHeader('content-security-policy',
    "default-src 'none';" +
    "base-uri 'none';" +
    'sandbox;' +
    "form-action 'none';" +
    "frame-ancestors 'none';" +
    "navigate-to 'none';" +
    "require-trusted-types-for 'script';" +
    'trusted-types;' +
    'upgrade-insecure-requests'
  )
  response.setHeader('permissions-policy', permissionsPolicyString)
  response.setHeader('origin-agent-cluster', '?1')
  response.setHeader('referrer-policy', 'no-referrer')
  response.setHeader('x-content-type-options', 'nosniff')
}

/**
 * @param {http.ServerResponse} response
 */
function setCustomHeaders (response) {
  response.setHeader('content-security-policy',
    "default-src 'none';" +
    "connect-src 'self';" +
    "script-src-elem 'self';" +
    "base-uri 'none';" +
    'sandbox allow-scripts;' +
    "form-action 'none';" +
    "frame-ancestors 'none';" +
    "navigate-to 'none';" +
    "require-trusted-types-for 'script';" +
    'trusted-types;' +
    'upgrade-insecure-requests'
  )
  response.setHeader('access-control-allow-origin', '*')
}

async function main () {
  const permissionsPolicyString = preparePermissionsPolicyList(
    await getPermissionsPolicyListFromChromium()
  )

  // TODO: WebBundles instead internalServer?
  const internalServer = http.createServer(async (request, response) => {
    const rootPath = './src/web'
    let requestPath = request.url
    if (requestPath === '/') {
      requestPath += 'index.html'
    }
    const fullPath = rootPath + requestPath

    let contentType = ''
    const fileExtension = path.extname(fullPath)
    if (fileExtension === '.html') {
      contentType = 'text/html;charset=utf-8'
    } else if (fileExtension === '.mjs') {
      contentType = 'text/javascript'
    }
    response.setHeader('content-type', contentType)

    setDefaultHeaders(response, permissionsPolicyString)
    setCustomHeaders(response)

    const file = await fs.readFile(fullPath)
    response.end(file)
  })

  const internalWebSocketServer = new WebSocketServer({
    host: '::1',
    perMessageDeflate: true,
    server: internalServer
  })

  /**
   * @type {import('ws').WebSocket}
   */
  let wsChromiumServer
  // TODO: Cleanup requestMap (old requests)
  const requestMap = new Map()
  let requestID = 0

  // TODO: Fix overflow (loop?)
  function getNewRequestID () {
    if (requestID <= Number.MAX_SAFE_INTEGER) {
      return requestID++
    } else {
      throw Error()
    }
  }

  // TODO: Chromium server authentication
  internalWebSocketServer.on('connection', (ws) => {
    wsChromiumServer = ws
    wsChromiumServer.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      const id = data[0]
      const headers = data[1]
      const content = data[2]
      // const response = requestMap
      ws.send(JSON.stringify([id, headers, content]))
    }
  })

  const externalServer = http.createServer((request, response) => {
    const id = getNewRequestID()
    requestMap.set(id, response)
    wsChromiumServer.send(JSON.stringify([id, request.url]))
  })

  internalServer.listen(8008, '::1')
  externalServer.listen(8080, '::1')
}

main()

// TODO: Review
