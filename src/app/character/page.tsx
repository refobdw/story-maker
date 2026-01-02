"use client";

import { useState } from "react";
import { Sparkles, Save, ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function CharacterMakePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ strength: string; weakness: string; profile: string } | null>(null);

    const generateCharacter = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/character/generate", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                alert("Error: " + data.error);
            }
        } catch (e) {
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                    Character Generator
                </h1>
                <p className="text-slate-400">
                    Forge a new soul with random strengths and flaws.
                </p>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={generateCharacter}
                    disabled={loading}
                    className={clsx(
                        "flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all",
                        loading
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-pink-600 hover:bg-pink-500 hover:scale-105 shadow-pink-500/25 text-white"
                    )}
                >
                    {loading ? (
                        "Sculpting persona..."
                    ) : (
                        <>
                            <UserPlus className="w-6 h-6" /> Generate Character
                        </>
                    )}
                </button>
            </div>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Strength</h3>
                            <p className="text-xl font-medium text-emerald-300">{result.strength}</p>
                        </div>
                        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Weakness</h3>
                            <p className="text-xl font-medium text-red-300">{result.weakness}</p>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 pointer-events-none" />

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-bold mb-4">Character Profile</h3>
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                                {result.profile}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex justify-end">
                            <SaveButton key={result.profile} strength={result.strength} weakness={result.weakness} profile={result.profile} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SaveButton({ strength, weakness, profile }: { strength: string, weakness: string, profile: string }) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/character/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ strength, weakness, profile }),
            });
            if (res.ok) {
                setSaved(true);
            } else {
                alert("Failed to save");
            }
        } catch (e) {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    if (saved) {
        return (
            <button disabled className="flex items-center gap-2 px-4 py-2 bg-emerald-600/50 text-emerald-200 rounded-lg font-medium cursor-default">
                Saved!
            </button>
        );
    }

    return (
        <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 rounded-lg transition font-medium border border-emerald-600/20 disabled:opacity-50"
        >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save to Sheets"}
        </button>
    );
}
