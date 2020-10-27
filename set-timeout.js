/**
 * Counter increases until timeout unction executes.
 */
let count = 0
setInterval(() => console.log(`[${++count}] slot consumed`), 1000)

setTimeout(() => {
    console.log('Transmission ended.')
    process.exit() // globally available without a need to import
}, 5000)