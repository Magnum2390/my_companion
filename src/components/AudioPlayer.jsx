import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, FastForward, Loader2 } from 'lucide-react';

export default function AudioPlayer({ book, chapter, verses, currentVerseIndex = 0, onVerseChange, onClose }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [voices, setVoices] = useState([]);
    const [rate, setRate] = useState(0.9); // Default slightly slower
    const [progress, setProgress] = useState(0); // 0-100 visual progress
    const synthRef = useRef(window.speechSynthesis);
    const utteranceRef = useRef(null);

    // Load Voices
    useEffect(() => {
        const loadVoices = () => {
            const vs = synthRef.current.getVoices();
            console.log("Loaded voices:", vs.length);
            setVoices(vs);
            if (vs.length > 0) setIsLoading(false);
        };

        loadVoices();
        if (synthRef.current.onvoiceschanged !== undefined) {
            synthRef.current.onvoiceschanged = loadVoices;
        }

        return () => {
            synthRef.current.cancel();
        };
    }, []);

    // Clean HTML tags from text
    const cleanText = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    // Play Logic
    useEffect(() => {
        if (!verses || verses.length === 0) return;

        // Stop any current speech
        synthRef.current.cancel();

        if (isPlaying) {
            // Safety check for index
            if (currentVerseIndex >= verses.length) {
                setIsPlaying(false);
                return;
            }

            const verse = verses[currentVerseIndex];
            // Fix: No longer read verse number, just the clean text
            const textToRead = cleanText(verse.text);

            const u = new SpeechSynthesisUtterance(textToRead);
            u.lang = 'fr-FR'; // Prioritize French
            u.rate = rate; // Speed

            // Select best French voice
            const frVoice = voices.find(v => v.lang === 'fr-FR') || voices.find(v => v.lang.startsWith('fr'));
            if (frVoice) u.voice = frVoice;

            // Events
            u.onend = () => {
                // Determine if we should go to next verse
                if (currentVerseIndex < verses.length - 1) {
                    onVerseChange(currentVerseIndex + 1);
                } else {
                    setIsPlaying(false); // End of chapter
                }
            };

            u.onerror = (e) => {
                console.error("Speech error", e);
                setIsPlaying(false);
            };

            // Progress estimation (simple)
            let charIndex = 0;
            const totalChars = textToRead.length;
            u.onboundary = (event) => {
                if (event.name === 'word') {
                    charIndex = event.charIndex;
                    setProgress((charIndex / totalChars) * 100);
                }
            };

            utteranceRef.current = u;
            // IMPORTANT: Assign to window to avoid Chrome GC bug
            window.utterance = u;

            synthRef.current.speak(u);
        } else {
            synthRef.current.cancel();
        }

    }, [currentVerseIndex, isPlaying, verses, rate, voices]); // Re-run if verse changes or play state changes

    // Toggle Play/Pause
    const togglePlay = () => {
        if (voices.length === 0) return; // Wait for voices
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        if (currentVerseIndex < verses.length - 1) {
            onVerseChange(currentVerseIndex + 1);
            setIsPlaying(true); // Ensure playing
        }
    };

    const handlePrev = () => {
        if (currentVerseIndex > 0) {
            onVerseChange(currentVerseIndex - 1);
            setIsPlaying(true);
        }
    };

    const toggleRate = () => {
        const rates = [0.8, 0.9, 1, 1.1, 1.25, 1.5];
        const idx = rates.indexOf(rate);
        setRate(rates[(idx + 1) % rates.length]);
    };

    if (!verses || verses.length === 0) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 bg-slate-900/90 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-white/10">

            {/* Header / Info */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Lecture Audio</h3>
                    <p className="font-serif font-bold text-lg leading-none">
                        {book} {chapter} <span className="text-accent font-sans text-sm ml-1">v.{verses[currentVerseIndex]?.verse}</span>
                    </p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                    <X size={18} />
                </button>
            </div>

            {/* Progress Bar (Visual) */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-accent transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between px-2">
                {/* Speed Toggle */}
                <button
                    onClick={toggleRate}
                    className="w-10 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                >
                    {rate}x
                </button>

                {/* Main Controls */}
                <div className="flex items-center gap-4">
                    <button onClick={handlePrev} disabled={currentVerseIndex === 0} className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                        <SkipBack size={24} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-14 h-14 flex items-center justify-center bg-white text-slate-900 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                    >
                        {isLoading ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={24} className="fill-current" />
                        ) : (
                            <Play size={24} className="fill-current ml-1" />
                        )}
                    </button>

                    <button onClick={handleNext} disabled={currentVerseIndex >= verses.length - 1} className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                        <SkipForward size={24} />
                    </button>
                </div>

                {/* Placeholder/Space balance */}
                <div className="w-10" />
            </div>
        </div>
    );
}
