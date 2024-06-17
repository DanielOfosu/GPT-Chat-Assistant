import { signIn, signOut, useSession } from 'next-auth/react';
import Link from "next/link";
import { FC } from "react";

export const Header: FC = () => {
  const { data: session, status } = useSession()
  const handleSignOut = async () => {
    await signOut()
  }

  const handleSignIn = async () => {
    await signIn()
  }
  return (
    <div className="flex h-[50px] backdrop-blur bg-white/50 shadow-xs sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
      <div className="font-bold text-3xl flex items-center">
        <Link
          className="ml-2 hover:opacity-50"
          href="/"
        >
          Assi
        </Link>

      </div>
      <button onClick={session ? handleSignOut : handleSignIn}>
          {session ? 'Logout' : 'Login'}
      </button>
    </div>
  );
};