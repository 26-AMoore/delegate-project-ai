//thx https://platform.openai.com/docs/guides/realtime#connect-with-webrtc

console.log("loaded voice.js")
let socket = new WebSocket('ws://127.0.0.1:3031/ws');
let EPHEMERAL_KEY = ""; //TODO! key

socket.send();
socket.addEventListener("message", function (event) {
	EPHEMERAL_KEY = event.data;
	console.log(EPHEMERAL_KEY)
	init();
})

async function init() {

	// Create a peer connection
	const pc = new RTCPeerConnection();

	// Set up to play remote audio from the model
	const audioEl = document.createElement("audio");
	audioEl.autoplay = true;
	pc.ontrack = e => audioEl.srcObject = e.streams[0];

	// Add local audio track for microphone input in the browser
	const ms = await navigator.mediaDevices.getUserMedia({
		audio: true
	});
	pc.addTrack(ms.getTracks()[0]);

	// Set up data channel for sending and receiving events
	const dc = pc.createDataChannel("oai-events");
	dc.addEventListener("message", (e) => {
		// Realtime server events appear here!
			console.log(e);
	});

	// Start the session using the Session Description Protocol (SDP)
	const offer = await pc.createOffer();
	await pc.setLocalDescription(offer);

	const baseUrl = "https://api.openai.com/v1/realtime";
	const model = "gpt-4o-realtime-preview-2024-12-17";
	const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
		method: "POST",
		body: offer.sdp,
		headers: {
			Authorization: `Bearer ${EPHEMERAL_KEY}`,
			"Content-Type": "application/sdp"
		},
	});

	const answer = {
		type: "answer",
		sdp: await sdpResponse.text(),
	};
	await pc.setRemoteDescription(answer);
}

