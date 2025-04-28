let websocket = new WebSocket("ws://127.0.0.1:3030/ws")

websocket.onopen = (event) => {
	websocket.send("connected")
}

websocket.onmessage = (event) => {
  console.log(event.data);
};
