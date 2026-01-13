import React, { useState, useEffect, useRef } from 'react';
import { Book, ChevronRight, ChevronLeft, Loader2, Type, X, Minimize2, Maximize2, Settings2, Heart, Headphones, Share2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBiblePlan } from '../hooks/useBiblePlan';
import AudioPlayer from './AudioPlayer';
import VerseSharer from './VerseSharer';
import { useToast } from '../context/ToastContext';

import { BIBLE_BOOKS } from '../data/bibleData';

export default function BibleReader() {
    const { addToast } = useToast();
    const { toggleFavorite, isFavorite } = useBiblePlan();
    const [book, setBook] = useState("Jean");
    const [chapter, setChapter] = useState(1);
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState('text-xl');
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState('next'); // 'next' or 'prev'

    // Audio Player State
    const [showAudioPlayer, setShowAudioPlayer] = useState(false);
    const [activeVerseIndex, setActiveVerseIndex] = useState(0);

    // Share State
    const [selectedVerse, setSelectedVerse] = useState(null);
    const [showSharer, setShowSharer] = useState(false);

    const bookRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Reset audio state when chapter changes
    useEffect(() => {
        setShowAudioPlayer(false);
        setActiveVerseIndex(0);
    }, [book, chapter]);

    // Handle navigation from Command Palette
    useEffect(() => {
        if (location.state && location.state.book && location.state.chapter) {
            setBook(location.state.book);
            setChapter(location.state.chapter);
        }
    }, [location.state]);

    const fetchChapter = async () => {
        setLoading(true);
        setError(null);

        // 1. Check Offline Status immediately
        if (!navigator.onLine) {
            setLoading(false);
            setError("Pas de connexion internet. Vérifiez votre réseau.");
            return;
        }

        try {
            const bookId = BIBLE_BOOKS.indexOf(book) + 1;
            if (bookId === 0) throw new Error("Livre non trouvé");

            const res = await fetch(`https://bolls.life/get-chapter/FRLSG/${bookId}/${chapter}/`);

            // 2. Handle HTTP Errors
            if (!res.ok) {
                if (res.status === 404) throw new Error("Chapitre introuvable.");
                if (res.status >= 500) throw new Error("Le serveur de la Bible est indisponible temporairement.");
                throw new Error("Erreur de chargement des données.");
            }

            const data = await res.json();

            // 3. Handle Empty Data
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
            console.error("Fetch Error:", err);
            // 4. Distinguish Network Errors (TypeError)
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
            } else {
                setError(err.message || "Une erreur est survenue.");
            }
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
            if (bookRef.current) bookRef.current.scrollTop = 0;
        }, 600);
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

    // Auto-scroll to active verse when it changes via audio
    useEffect(() => {
        if (showAudioPlayer && activeVerseIndex > 0) {
            const verseElement = document.getElementById(`verse-${activeVerseIndex}`);
            if (verseElement) {
                verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeVerseIndex, showAudioPlayer]);

    const handleShare = (verse) => {
        setSelectedVerse(verse);
        setShowSharer(true);
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
                        {/* Audio Trigger */}
                        <button
                            onClick={() => setShowAudioPlayer(!showAudioPlayer)}
                            className={`p-2 rounded-lg transition-colors ${showAudioPlayer ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-accent hover:bg-slate-50'}`}
                            title="Écouter le chapitre"
                        >
                            <Headphones size={22} className={showAudioPlayer ? "animate-pulse" : ""} />
                        </button>

                        <div className="h-6 w-px bg-slate-200 mx-2" />

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
            </div>

            {/* Main Reading Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-dots-pattern" ref={bookRef}>
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 pb-48">

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4 animate-pulse">
                            <Book size={48} className="text-slate-200" />
                            <p className="text-xs font-bold tracking-widest uppercase text-slate-300">Chargement du chapitre...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-32 text-red-500 gap-4">
                            <p className="text-lg font-medium text-center px-4">{error}</p>
                            <button
                                onClick={fetchChapter}
                                className="px-6 py-2 bg-red-50 text-red-600 rounded-full font-bold hover:bg-red-100 transition-colors shadow-sm"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-4 duration-700 ease-out">
                            {/* Chapter Title */}
                            <div className="text-center mb-12 relative">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-2 block">Sainte Bible</span>
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                                    {book} <span className="text-accent/80">{chapter}</span>
                                </h1>
                                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6 opacity-30" />
                            </div>

                            {/* Verses Content */}
                            <div className={`space-y-6 ${fontSize} text-slate-700 leading-relaxed font-serif`}>
                                {verses.map((verse, index) => {
                                    const isActive = showAudioPlayer && activeVerseIndex === index;
                                    return (
                                        <div
                                            key={verse.verse}
                                            id={`verse-${index}`}
                                            className={`group relative pl-2 md:pl-0 transition-all duration-500 rounded-xl p-2 ${isActive ? 'bg-accent/10 shadow-sm scale-[1.01] -mx-2 px-4' : ''}`}
                                        >
                                            {/* Verse Number */}
                                            <span className={`hidden md:inline-block absolute ${isActive ? '-left-8' : '-left-12'} top-3 text-xs font-sans font-bold select-none w-8 text-right transition-colors ${isActive ? 'text-accent' : 'text-slate-300 group-hover:text-accent'}`}>
                                                {verse.verse}
                                            </span>
                                            <span className={`md:hidden inline-block mr-2 text-xs font-sans font-bold select-none align-top mt-1 ${isActive ? 'text-accent' : 'text-accent'}`}>
                                                {verse.verse}
                                            </span>

                                            {/* Text Engine */}
                                            <span
                                                dangerouslySetInnerHTML={{ __html: verse.text }}
                                                className={`decoration-accent/30 underline-offset-4 selection:bg-accent/20 ${isActive ? 'text-slate-900' : ''}`}
                                            />

                                            {/* Quick Actions */}
                                            <div className="inline-flex items-center align-middle ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const id = `${book}-${chapter}-${verse.verse}`;
                                                        const wasFav = isFavorite(id);
                                                        toggleFavorite({
                                                            id,
                                                            book,
                                                            chapter,
                                                            verse: verse.verse,
                                                            text: verse.text
                                                        });
                                                        if (wasFav) {
                                                            addToast("Retiré des favoris", "info");
                                                        } else {
                                                            addToast("Ajouté aux favoris", "success");
                                                        }
                                                    }}
                                                    className={`p-1.5 rounded-full transition-all ${isFavorite(`${book}-${chapter}-${verse.verse}`) ? 'text-red-500 bg-red-50 opacity-100' : 'text-slate-300 hover:text-red-400 hover:bg-slate-50'}`}
                                                    title="Ajouter aux favoris"
                                                >
                                                    <Heart size={16} className={isFavorite(`${book}-${chapter}-${verse.verse}`) ? "fill-current" : ""} />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShare(verse);
                                                    }}
                                                    className="p-1.5 rounded-full transition-all text-slate-300 hover:text-accent hover:bg-blue-50 ml-1"
                                                    title="Créer une image"
                                                >
                                                    <Share2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Floating Navigation Pill */}
                            {!showAudioPlayer && (
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
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* Audio Player Overlay */}
            {showAudioPlayer && (
                <AudioPlayer
                    book={book}
                    chapter={chapter}
                    verses={verses}
                    currentVerseIndex={activeVerseIndex}
                    onVerseChange={(index) => setActiveVerseIndex(index)}
                    onClose={() => setShowAudioPlayer(false)}
                />
            )}

            {/* Verse Sharer Overlay */}
            {showSharer && selectedVerse && (
                <VerseSharer
                    verse={selectedVerse}
                    book={book}
                    chapter={chapter}
                    onClose={() => setShowSharer(false)}
                />
            )}

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
