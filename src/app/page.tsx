import Link from "next/link";
import { BookOpen, Users } from "lucide-react";
import clsx from "clsx";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300">
          StoryMaker
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl">
          Ignite your creativity with AI-powered plot and character generation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <MenuCard
          href="/plot"
          title="Plot Make"
          description="Generate unique story plots from random topics."
          icon={<BookOpen className="w-12 h-12 mb-4 text-indigo-400" />}
          gradient="from-indigo-500/20 to-blue-500/5"
          border="border-indigo-500/30 hover:border-indigo-400"
        />
        <MenuCard
          href="/character"
          title="Character Make"
          description="Create deep characters with random strengths and weaknesses."
          icon={<Users className="w-12 h-12 mb-4 text-pink-400" />}
          gradient="from-pink-500/20 to-rose-500/5"
          border="border-pink-500/30 hover:border-pink-400"
        />
      </div>
    </div>
  );
}

function MenuCard({ href, title, description, icon, gradient, border }: { href: string, title: string, description: string, icon: React.ReactNode, gradient: string, border: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group relative flex flex-col items-center text-center p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10",
        "bg-gradient-to-br", gradient, border
      )}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        {icon}
        <h2 className="text-3xl font-bold text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-400">{description}</p>
      </div>
    </Link>
  );
}
