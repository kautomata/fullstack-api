const fs = require('fs')

function mapAsync(arr, fn onFinish) {
    let prevError
    let nRemaining = arr.length
    const results = []

    arr.forEach(function(item, i) {
        fn(item, function (e, data) {
            if (prevError) return

            if (e) {
                prevError = e
                return onFinish(e)
            }
            results[i] = data
            nRemaining--
            if(!nRemaining) onFinish(null, results)
        })
    })
}