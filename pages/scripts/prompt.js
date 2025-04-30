let socket = new WebSocket('ws://127.0.0.1:3030/ws');
let input = document.getElementById("prompt")
let response = document.getElementById("response")

/// Send whatever the data in input.value is
function send() {
	console.log(input.value)
	socket.send(input.value.replaceAll("\n", ""));
}

// check if 
input.addEventListener("keydown", function (event) {
	if (event.key === "Enter" && input.value.replaceAll("\n", "")) {
		send();
		response.insertAdjacentHTML("beforeend", "<div class=\"old-prompt\">" + input.value + "</div>")
		input.value = null;
	}
})

socket.addEventListener("message", function (event) {
	console.log("DATA: " + event.data)
	response.insertAdjacentHTML("beforeend" ,"<div class=\"old-response\">" + event.data + "</div>")
})
