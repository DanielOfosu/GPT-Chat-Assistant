
import Head from "next/head";
import Link from 'next/link';
import Footer from "../components/Footer";
import { Header } from "../components/Header";
import styles from '../styles/Home.module.css';
export default function Home() {
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
          <div className="max-w-[800px] flex flex-row justify-content grid h-[60vh] border-neutral-300 rounded-lg mx-auto mt-4 sm:mt-12 backdrop-blur bg-white/25 shadow-xl">
            <h1 className="text-xl justify-content flex text-center px-20 m-auto">Welcome, click one of the buttons below to choose your mode:</h1>
            <div className="flex justify-center mt-6 overflow-hidden px-20">
            <Link href="/chat" className={`${styles.btn} mx-1 py-2 px-5`}>Chat</Link>
            <Link href="/code" className={`${styles.btn} mx-1 py-2 px-5`}>Code</Link>
            <Link href="/thesis" className={`${styles.btn} mx-1 py-2 px-5`}>Thesis</Link>
            <Link href="/gpt4" className={`${styles.btn} mx-1 py-2 px-5`}>GPT-4</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
