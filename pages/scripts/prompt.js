let socket = new WebSocket('ws://127.0.0.1:3030/ws');
let input = document.getElementById("prompt")

function send() {
	console.log(input.value)
	socket.send(input.value)
}

input.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		send();
	}
})

socket.addEventListener("message", function (event) {
	console.log("DATA: " + event.data)
})
