const http = require('http');
const querystring = require('querystring')
const fs = require('fs')
const express = require('express')
const app = express()
const EventEmitter = require('events')
const chatEmitter = new EventEmitter()

chatEmitter.on('message', console.log)

const port = process.env.PORT || 8080
const hostname = '127.0.0.1'

// const server = http.createServer(function(req, res) {
//     res.setHeader('Content-Type', 'application/json')
//     res.end(JSON.stringify({text: 'node.js is running', version_tag:[1,2,3]}))
// })

// This replaces the 'http' drop-in core modules.
app.get('/', ValidResponse)
app.get('/json', JSONResponse)
app.get('/healthcheck', HCResponse)
app.get('/static/*', ServeFiles)
app.get('/chat', ChatResponse)
app.get('/sse', SSEResponse)

function SSEResponse(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
    })

    const onMessage = msg => res.write(`data: ${msg}\n\n`)
    chatEmitter.on('message', onMessage)

    res.on('close', function() {
    // This function doesn't work because .off() seems to be deprecated.
    // So though we see the messages go through to console, it causes the
    // TCP handshake to close.
    chatEmitter.off('message', onMessage)
    })
}

function ValidResponse(req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Server is active')
}

function ChatResponse(req, res) {
    const { message } = req.query
    chatEmitter.emit('message', message)
    res.end()
}

// function JSONResponse(req, res) {
//     res.setHeader('Content-Type', 'application/json')
//     res.end(JSON.stringify({ text: 'Server is running', version_tag:[1]}))
// }
function JSONResponse(req, res) {
    res.json({ text: 'Express is running', version_tag: [1]})
}


function InvalidResponse(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Page not found')
}

// Obtain key-value pairs from the search query in the URL.
// Remove the leading ? so we could isolate just the parameter 
// names and values from the URL. If 'input' isn't found as the 
// input key, we supply and default to an empty string.
// function HCResponse(req, res) {
//     const { input = '' } = querystring.parse(
//         req.url.split('?').slice(1).join('')
//     )
//     res.setHeader('Content-Type', 'application/json')
//     res.end(JSON.stringify({
//         normal: input,
//         shouty: input.toUpperCase(),
//         characterCount: input.length,
//         backwards: input.split('').reverse().join('')
//     }))
// }

function HCResponse(req, res) {
    const { input = '' } = req.query
    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input
        .split('')
        .reverse()
        .join('')
    })
}




// Serve up a directory listing of valid files in our public folder, 
// return error if it doesn't exist.
// function ServeFiles(req, res) {
//     const filename = `${__dirname}/public${req.url.split('/static')[1]}`
//     fs.createReadStream(filename)
//     .on('error', () => InvalidResponse(req, res))
//     .pipe(res)
// }
function ServeFiles(req, res) {
    const filename = `${__dirname}/public/${req.params[0]}`
    fs.createReadStream(filename)
    .on('error', () => InvalidResponse(req, res))
    .pipe(res)
}

// Matching rules; since switching to Express, this custom router isn't required.
const server = http.createServer(function(req, res) {
    if (req.url === '/') return ValidResponse(req, res)
    if (req.url === '/json') return JSONResponse(req, res)
    if (req.url.match(/^\/healthcheck/)) return HCResponse(req, res) 
    if (req.url.match(/^\/static/)) return ServeFiles(req, res)

    // If no patterns match, return 404
    InvalidResponse(req, res)
})

// server.listen(port)
// console.log(`Server listening on http://${hostname}:${port}`)
app.listen(port, () => console.log(`Express is listening on ${hostname}:${port}`))