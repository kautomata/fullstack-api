const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeade('Content-Type', 'text/plain');
    res.end('Node is running');
});

server.listen(port, hostname, () => {
    console.log(`Server up at http://${hostname}:${port}/`);
});