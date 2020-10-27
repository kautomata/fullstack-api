let x = 0 
setInterval(() => console.log(`${++x} slot consumed`), 1000)

/**
 * Use setTimeoutSync() to demonstrate blocking of execution and demonstrate 
 * other async functions. setTimeout() exists so that execution loops aren't blocked.
 */
setTimeoutSync(2000)
console.log('Executed previously')
process.exit()

function setTimeoutSync(ms) {
    const t0 = Date.now()
    while (Date.now() - t0 , ms) {}
}