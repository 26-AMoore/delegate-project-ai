use futures_util::{future, SinkExt, StreamExt, TryFutureExt};
use warp::{filters::ws::Message, Filter};
mod chatbot;

#[tokio::main]
async fn main() {
	let main = warp::fs::dir("pages");
	let debug = warp::path!("index" / String).map(|input| format!("Hello {}", input));

	let ws = warp::path("ws").and(warp::ws()).map(|ws: warp::ws::Ws| {
		ws.on_upgrade(async |web_socket| {
			let (mut tx, mut rx) = web_socket.split();

			loop {
				let received = rx.next().await;
				if received.is_none() {
					break;
				}
				if let Ok(prompt) = received.unwrap() {
					let mut response: String = String::from("null");
					if prompt.is_text() {
						//response = chatbot::get_response(prompt.to_str().unwrap()).await;
						response = String::from("New Response");
					}
					tx.send(Message::text(response))
						.unwrap_or_else(|e| eprintln!("Websocket Error {}", e))
						.await
				} else {
					break;
				}
			}
		})
	});

	let address = [0, 0, 0, 0];
	let main_serve = warp::serve(main)
		.tls()
		.cert_path("tls/cert.pem")
		.key_path("tls/key.pem")
		.run((address, 8080));
	let debug_serve = warp::serve(debug).run((address, 7878));
	let ws_serve = warp::serve(ws).run((address, 3030));

	future::join3(main_serve, debug_serve, ws_serve).await;
}
