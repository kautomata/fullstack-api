// Simple client-side JS to handle communication with our server
new window.EventSource('/sse').onmessage = function(event) {
    window.messages.innerHTL += `<p>${event.data}</p>`
}

window.form.addEventListener('submit', function(evt) {
    evt.preventDefault()
    window.fetch(`/chat?message=${window.input.value}`)
    window.input.value = ''
})