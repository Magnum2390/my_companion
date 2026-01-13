import React, { useState, useRef } from 'react';
import { X, Download, Share2, Palette, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '../context/ToastContext';

export default function VerseSharer({ verse, book, chapter, onClose }) {
    const { addToast } = useToast();
    const [theme, setTheme] = useState('light'); // light, dark, sunset, ocean
    const [isExporting, setIsExporting] = useState(false);
    const [copied, setCopied] = useState(false);
    const previewRef = useRef(null);

    const themes = {
        light: "bg-white text-slate-900 border-slate-200",
        dark: "bg-slate-900 text-white border-slate-800",
        sunset: "bg-gradient-to-br from-orange-100 to-rose-200 text-rose-950 border-rose-200",
        ocean: "bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-950 border-indigo-200",
        midnight: "bg-gradient-to-br from-slate-900 to-indigo-950 text-indigo-100 border-indigo-800"
    };

    const handleDownload = async () => {
        if (!previewRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(previewRef.current, {
                scale: 2, // Retina quality
                backgroundColor: null,
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = `Verset-${book}-${chapter}-${verse.verse}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            addToast("Image téléchargée avec succès !", "success");
        } catch (err) {
            console.error("Export failed", err);
            addToast("Échec du téléchargement.", "error");
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopy = async () => {
        if (!previewRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(previewRef.current, { scale: 2, backgroundColor: null });
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    setCopied(true);
                    addToast("Image copiée dans le presse-papier !", "success");
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error("Clipboard failed", err);
                    addToast("Impossible de copier dans le presse-papier.", "error");
                }
            });
        } catch (err) {
            console.error("Export failed", err);
            addToast("Erreur lors de la génération de l'image.", "error");
        } finally {
            setIsExporting(false);
        }
    };

    // Clean HTML for display
    const cleanText = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerText; // Keep structure but remove tags
    };

    return (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Share2 size={20} className="text-accent" />
                        Partager le verset
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col items-center">

                    {/* Preview Area */}
                    <div className="mb-8 w-full flex justify-center">
                        <div
                            ref={previewRef}
                            className={`aspect-square w-full max-w-[350px] shadow-xl rounded-none p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-300 ring-1 ring-black/5 ${themes[theme]}`}
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-accent/20" />

                            <div className="flex-1 flex flex-col items-center justify-center">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-6">Sainte Bible</span>

                                <p className="font-serif text-2xl leading-relaxed mb-6 font-medium selection:bg-transparent">
                                    "{cleanText(verse.text)}"
                                </p>

                                <div className="w-12 h-px bg-current opacity-30 mb-6" />

                                <p className="font-sans font-bold text-sm tracking-wide uppercase">
                                    {book} {chapter}:{verse.verse}
                                </p>
                            </div>

                            {/* Watermark */}
                            <div className="absolute bottom-3 right-4 opacity-20 text-[10px] uppercase tracking-widest font-sans">
                                Bible Companion
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="w-full max-w-[350px] space-y-6">
                        {/* Theme Selector */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                                <Palette size={14} /> Thème
                            </label>
                            <div className="flex gap-2 justify-center">
                                {Object.keys(themes).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${themes[t].split(' ')[0]} ${theme === t ? 'border-accent ring-2 ring-accent/20 scale-110' : 'border-transparent text-transparent'}`}
                                        title={t}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleCopy}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                {copied ? "Copié !" : "Copier"}
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={isExporting}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                            >
                                {isExporting ? (
                                    <span className="animate-spin">⌛</span>
                                ) : (
                                    <Download size={18} />
                                )}
                                Télécharger
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
