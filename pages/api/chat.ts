import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { NextRequest } from "next/server";
import { Message } from "../../types/index";

export const config = {
  runtime: "edge"
};

export default async function handler(req: NextRequest) {
  try {
    const { messages,mode } = (await req.json()) as {
      messages: Message[];
      mode: string;
    };

    let initialMessage:string
  if (mode == "Chat"){
    initialMessage = "act as a world-class chat assistant who knows about all matters and helps by answering all questions. Always ask extra questions after answering. Please use emojis to make the chat seem more friendly and fun."
  }
  if (mode == "Code"){
    initialMessage = "act as a world-class coding assistant who knows everything about all coding languages. the user is a junior developer who needs help."
  }if (mode == "Thesis"){
    initialMessage = "act as a world-class master's thesis assistant who knows everything about academic writing. the user is a master's level student who needs help. your tasks may be ones such as making the text better or coming up with ideas or structuring for the thesis."
  }else{
    initialMessage = `You are a world-class expert on a topic. You are given a question from a user. You must answer the question factually and with a reason.`
  }

  let gpt_version:string
  console.log(mode)
  if (mode == "GPT-4"){
  gpt_version = "gpt-4"}
  else{
  gpt_version = "gpt-3.5-turbo"
  }
  
    const charLimit = 12000;
    let charCount = 0;
    let messagesToSend = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (charCount + message.content.length > charLimit) {
        break;
      }
      charCount += message.content.length;
      messagesToSend.push(message);
    }
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        method: "POST",
        body: JSON.stringify({
          model: gpt_version,
          messages: [
            {
              role: "system",
              content: initialMessage
            },
            ...messages
          ],
          max_tokens: 2048,
          temperature: 0.7,
          stream: true
        })
      });
  
    if (res.status !== 200) {
      throw new Error("OpenAI API returned an error");
    }
  
    const stream = new ReadableStream({
      async start(controller) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;
  
            if (data === "[DONE]") {
              controller.close();
              return;
            }
  
            try {
              const json = JSON.parse(data);
              const text = json.choices[0].delta.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              controller.error(e);
            }
          }
        };
  
        const parser = createParser(onParse);
  
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      }
    });

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};
