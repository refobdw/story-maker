"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, LogIn } from "lucide-react";

export function Header() {
    const { data: session } = useSession();

    return (
        <header className="flex justify-between items-center p-6 bg-slate-950 border-b border-slate-800">
            <Link href="/" className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                StoryMaker
            </Link>
            <nav className="flex items-center gap-6">
                {session ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">{session.user?.email}</span>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => signIn("google")}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 text-sm font-medium"
                    >
                        <LogIn className="w-4 h-4" />
                        Sign In with Google
                    </button>
                )}
            </nav>
        </header>
    );
}
