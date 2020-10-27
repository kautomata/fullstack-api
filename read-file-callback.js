const fs = require('fs')
const filename = 'read-file-callback1.js'

/**
 * Core 'fs' module used for interacting with the filesystem and I/O.
 * fs.readFile() requires two args, filename and a callback. The call-
 * back is always the last argument. (e, data) is an anonymous function.
 */
fs.readFile(filename, (e, data) => {
    if (e) return console.error(e)
    console.log(`${filename}: ${data.length}`)
})