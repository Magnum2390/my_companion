import React, { useState, useEffect, useRef } from 'react';
import { Book, ChevronRight, ChevronLeft, Loader2, Type, X, Minimize2, Maximize2, Settings2, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBiblePlan } from '../hooks/useBiblePlan';

import { BIBLE_BOOKS } from '../data/bibleData';

export default function BibleReader() {
    const { toggleFavorite, isFavorite } = useBiblePlan();
    const [book, setBook] = useState("Jean");
    const [chapter, setChapter] = useState(1);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState('text-xl');
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'

    const bookRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle navigation from Command Palette
    useEffect(() => {
        if (location.state && location.state.book && location.state.chapter) {
            setBook(location.state.book);
            setChapter(location.state.chapter);
            // Clear state so it doesn't persist on refresh if not desired, 
            // but usually safe to keep. 
            // Ideally we strictly follow URL params, but here we use state for "jump".
            // Replace history to avoid "back" button looping loops if needed, but standard is fine.
        }
    }, [location.state]);

    const fetchChapter = async () => {
        setLoading(true);
        setError(null);
        try {
            // Map book name to ID (1-66)
            const bookId = BIBLE_BOOKS.indexOf(book) + 1;
            if (bookId === 0) throw new Error("Livre non trouvé");

            const res = await fetch(`https://bolls.life/get-chapter/FRLSG/${bookId}/${chapter}/`);
            if (!res.ok) throw new Error("Erreur de chargement");

            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) {
                if (chapter > 1) {
                    setError("Fin du livre atteinte.");
                } else {
                    setError("Impossible de charger le texte.");
                }
                setVerses([]);
            } else {
                setVerses(data);
            }
        } catch (err) {
            console.error(err);
            setError("Impossible de charger le chapitre.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapter();
    }, [book, chapter]);

    const handleNext = () => {
        setFlipDirection('next');
        setIsFlipping(true);
        setTimeout(() => {
            setChapter(c => c + 1);
            setIsFlipping(false);
            // Reset scroll of the book content
            if (bookRef.current) bookRef.current.scrollTop = 0;
        }, 600); // Wait for half animation
    };

    const handlePrev = () => {
        if (chapter <= 1) return;
        setFlipDirection('prev');
        setIsFlipping(true);
        setTimeout(() => {
            setChapter(c => Math.max(1, c - 1));
            setIsFlipping(false);
            if (bookRef.current) bookRef.current.scrollTop = 0;
        }, 600);
    };

    const toggleFontSize = () => {
        if (fontSize === 'text-lg') setFontSize('text-xl');
        else if (fontSize === 'text-xl') setFontSize('text-2xl');
        else setFontSize('text-lg');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300 font-sans text-slate-900">
            {/* Minimal Sticky Header */}
            <div className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[95vw] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                            title="Fermer"
                        >
                            <X size={22} />
                        </button>

                        <div className="h-6 w-px bg-slate-200" />

                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <select
                                    value={book}
                                    onChange={(e) => { setBook(e.target.value); setChapter(1); }}
                                    className="appearance-none bg-transparent font-bold text-lg text-slate-900 cursor-pointer pr-6 outline-none hover:text-accent transition-colors"
                                >
                                    {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <span className="text-slate-300 font-light">/</span>
                            <div className="flex items-center hover:bg-slate-100 rounded px-2 py-1 transition-colors cursor-pointer group">
                                <span className="text-sm font-medium text-slate-500 mr-2 group-hover:text-slate-800">Ch.</span>
                                <input
                                    type="number"
                                    value={chapter}
                                    onChange={(e) => setChapter(parseInt(e.target.value) || 1)}
                                    className="w-12 bg-transparent text-lg font-bold text-slate-900 outline-none text-center"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={handlePrev} disabled={chapter <= 1} className="hidden md:block p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors">
                            <ChevronLeft size={22} />
                        </button>
                        <button onClick={handleNext} className="hidden md:block p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                            <ChevronRight size={22} />
                        </button>
                        <div className="hidden md:block h-6 w-px bg-slate-200 mx-2" />
                        <button onClick={toggleFontSize} className="p-2 text-slate-400 hover:text-accent hover:bg-blue-50 rounded-lg transition-colors">
                            <Type size={22} />
                        </button>
                    </div>
                </div>

                {/* Main Reading Area - Centered for Readability but Wide enough */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-dots-pattern" ref={bookRef}>
                    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 pb-32"> {/* Added pb-32 to clear bottom nav */}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4 animate-pulse">
                                <Book size={48} className="text-slate-200" />
                                <p className="text-xs font-bold tracking-widest uppercase text-slate-300">Chargement du chapitre...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-32 text-red-500 gap-4">
                                <p className="text-lg font-medium">{error}</p>
                                <button onClick={() => window.location.reload()} className="text-sm underline">Réessayer</button>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-bottom-4 duration-700 ease-out">
                                {/* Chapter Title with Decorative elements */}
                                <div className="text-center mb-12 relative">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2 block">Sainte Bible</span>
                                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                                        {book} <span className="text-accent/80">{chapter}</span>
                                    </h1>
                                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6 opacity-30" />
                                </div>

                                {/* Verses Content - Optimized Typography */}
                                <div className={`space-y-6 ${fontSize} text-slate-700 leading-relaxed font-serif`}>
                                    {verses.map((verse) => (
                                        <div key={verse.verse} className="group relative pl-2 md:pl-0 transition-colors">
                                            {/* Verse Number - Floating in margin on Desktop, Inline on Mobile */}
                                            <span className="hidden md:inline-block absolute -left-12 top-1 text-xs font-sans font-bold text-slate-300 select-none w-8 text-right group-hover:text-accent transition-colors">
                                                {verse.verse}
                                            </span>
                                            <span className="md:hidden inline-block mr-2 text-xs font-sans font-bold text-accent select-none align-top mt-1">
                                                {verse.verse}
                                            </span>

                                            {/* Text Engine */}
                                            <span
                                                dangerouslySetInnerHTML={{ __html: verse.text }}
                                                className="decoration-accent/30 underline-offset-4 selection:bg-accent/20"
                                            />

                                            {/* Quick Interactive Actions (Selection-like) */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite({
                                                        id: `${book}-${chapter}-${verse.verse}`,
                                                        book,
                                                        chapter,
                                                        verse: verse.verse,
                                                        text: verse.text
                                                    });
                                                }}
                                                className={`inline-flex items-center justify-center ml-2 p-1.5 rounded-full transition-all align-middle opacity-0 group-hover:opacity-100 ${isFavorite(`${book}-${chapter}-${verse.verse}`) ? 'opacity-100 text-red-500 bg-red-50' : 'text-slate-300 hover:text-red-400 hover:bg-slate-50'}`}
                                            >
                                                <Heart size={16} className={isFavorite(`${book}-${chapter}-${verse.verse}`) ? "fill-current" : ""} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Floating Navigation Pill - Pure Glassmorphism */}
                                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-2 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full animate-in slide-in-from-bottom-6 duration-500 ring-1 ring-slate-900/5 hover:scale-105 transition-transform">
                                    <button
                                        onClick={handlePrev}
                                        disabled={chapter <= 1}
                                        className="p-3 rounded-full hover:bg-slate-900/5 text-slate-500 hover:text-slate-900 disabled:opacity-20 disabled:hover:bg-transparent transition-all active:scale-95"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <div className="h-4 w-px bg-slate-200 mx-2" />

                                    <div className="flex flex-col items-center min-w-[100px] cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-accent transition-colors">Chapitre</span>
                                        <span className="font-serif font-bold text-xl text-slate-800 leading-none">{chapter}</span>
                                    </div>

                                    <div className="h-4 w-px bg-slate-200 mx-2" />

                                    <button
                                        onClick={handleNext}
                                        className="p-3 rounded-full hover:bg-slate-900/5 text-slate-500 hover:text-slate-900 transition-all active:scale-95"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Keyboard Shortcuts Listener */}
                <ShortcutListener onNext={handleNext} onPrev={handlePrev} />

                {/* Hide Scrollbar Style */}
                <style jsx>{`
                                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.2); }
                            `}</style>
            </div>
        </div>
    );
}

// Helper Component for Keyboard Shortcuts
function ShortcutListener({ onNext, onPrev }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrev]);
    return null;
}
