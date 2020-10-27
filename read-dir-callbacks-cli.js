const fs = require('fs')
const path = require('path')

const targetDirectory = process.argv[2] || './'

getFileLengths(targetDirectory, function(e, results) {
    if (e) return console.error(e)

    results.forEach(([file, length]) => console.log(`${file}: ${length}`))
    console.log('\nListing the contents of current directory.')
})

function getFileLengths(dir, cb) {
    fs.readdir(dir, function(e, files) {
        if (e) return cb(e)
        const filePaths = files.map(file => path.join(dir, file))
        mapAsync(filePaths, readFile, cb)
    })
}

function readFile(file, cb) {
    fs.readFile(file, function(e, data) {
        if (e) {
            if (e.code === 'EISDIR') return cb(null, [file, 0])
            return cb(e)
        }
        cb(null, [file, data.length])
    })
}

function mapAsync(arr, fn, onFinish) {
    let prevError
    let nRemaining = arr.length
    const results = []

    arr.forEach(function (item, i) {
        fn(item, function(e, data) {
            if (prevError) return
            if (e) {
                prevError = e
                return onFinish(e)
            }
            results[i] = data
            nRemaining--
            if (!nRemaining) onFinish(null, results)
        })
    })
}