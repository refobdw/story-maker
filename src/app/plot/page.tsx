"use client";

import { useState } from "react";
import { Sparkles, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function PlotMakePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ topic: string; material: string; plot: string } | null>(null);

    const generatePlot = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/plot/generate", { method: "POST" });
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
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-400">
                    Plot Generator
                </h1>
                <p className="text-slate-400">
                    Randomly selects a topic and material from your Sheet to spark a new story.
                </p>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={generatePlot}
                    disabled={loading}
                    className={clsx(
                        "flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all",
                        loading
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-500 hover:scale-105 shadow-indigo-500/25 text-white"
                    )}
                >
                    {loading ? (
                        "Dreaming up a story..."
                    ) : (
                        <>
                            <Sparkles className="w-6 h-6" /> Generate Plot
                        </>
                    )}
                </button>
            </div>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Topic</h3>
                            <p className="text-xl font-medium text-indigo-300">{result.topic}</p>
                        </div>
                        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Material</h3>
                            <p className="text-xl font-medium text-pink-300">{result.material}</p>
                        </div>
                    </div>

                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-bold mb-4">Generated Plot</h3>
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
                                {result.plot}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex justify-end">
                            <SaveButton key={result.plot} topic={result.topic} material={result.material} plot={result.plot} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SaveButton({ topic, material, plot }: { topic: string, material: string, plot: string }) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/plot/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, material, plot }),
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
