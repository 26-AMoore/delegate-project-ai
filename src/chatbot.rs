use openai_api_rs::v1::{
	api::OpenAIClient,
	chat_completion::{self, ChatCompletionRequest},
	common::GPT4_O,
};

pub async fn get_response(request: &str) -> String {
	let api_key = std::env::var("OPENAI_API_KEY").unwrap();
	let req = ChatCompletionRequest::new(
		GPT4_O.to_string(),
		vec![chat_completion::ChatCompletionMessage {
			role: chat_completion::MessageRole::user,
			content: chat_completion::Content::Text(String::from("")),
			name: None,
			tool_calls: None,
			tool_call_id: None,
		}],
	);
	let mut client = OpenAIClient::builder()
		.with_api_key(api_key)
		.build()
		.unwrap();
	let result = client.chat_completion(req).await.unwrap();
	result.choices[0].message.content.clone().unwrap()
}
//
//let result = client.chat_completion(req).await.unwrap();
//println!("Content: {:?}", result.choices[0].message.content);
//
//let message = result.choices[0].message.clone();
//
//let response = http::Response::builder()
//	.status(200)
//	.body(message.content.unwrap().as_bytes())
//	.unwrap_or(Response::default());
//
//let _ = stream.write(response.status().to_string().as_bytes());
//
//for (key, value) in client.headers.unwrap().iter() {
//	println!("{}: {:?}", key, value);
//}
