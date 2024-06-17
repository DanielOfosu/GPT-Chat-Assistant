
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Chat } from "../components/Chat/Chat";
import Footer from "../components/Footer";
import { Header } from "../components/Header";
import { Message } from "../types/index";
interface HomeProps {
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}
export default function Home({ mode, setMode }: HomeProps) {
  setMode('Thesis')
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: updatedMessages,
        mode: mode
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            content: chunkValue
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi, I am Assi. I am here to help you with your thesis.`,
      }
    ]);
  }, []);
  if (session){
  return (
    <>
      <Head>
        <title>Assi Chat Assistant</title>
        <meta
          name="description"
          content="Assi chat assistant"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Header />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] rounded-lg mx-auto mt-4 sm:mt-12 backdrop-blur bg-white/25 shadow-xl">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );}
  return (
    <>
      <Head>
        <title>Assi Chat Assistant</title>
        <meta
          name="description"
          content="Assi chat assistant"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Header />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] rounded-lg py-10 min-h-[60vh] px-10 mx-auto mt-4 sm:mt-12 backdrop-blur bg-white/25 shadow-xl">
           <h1 className="text-xl text-center">Please login first</h1>
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
