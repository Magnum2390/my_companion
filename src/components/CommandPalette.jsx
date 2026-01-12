import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Calendar, Book, PenTool, Layout, X, ArrowRight } from 'lucide-react';
import { BIBLE_BOOKS } from '../data/bibleData';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Toggle with Cmd+K or Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery(''); // Reset query on open
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Navigation Items
    const navItems = [
        { id: 'home', label: 'Accueil', icon: Layout, action: () => navigate('/') },
        { id: 'bible', label: 'Lire la Bible', icon: Book, action: () => navigate('/bible') },
        { id: 'calendar', label: 'Calendrier', icon: Calendar, action: () => navigate('/calendrier') },
        { id: 'journal', label: 'Journal', icon: PenTool, action: () => navigate('/journal') },
    ];

    // Filter Logic
    const filteredBooks = query ? BIBLE_BOOKS.filter(b => b.toLowerCase().includes(query.toLowerCase())) : [];
    const filteredNav = navItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

    // Combine results: Navigation first, then Books
    // Basic parser for "John 3" -> Book: John, Chapter: 3
    const parseBibleRef = () => {
        const parts = query.trim().split(' ');
        const lastPart = parts[parts.length - 1];
        const possibleChapter = parseInt(lastPart);

        if (!isNaN(possibleChapter)) {
            const possibleBookName = parts.slice(0, parts.length - 1).join(' ');
            const foundBook = BIBLE_BOOKS.find(b => b.toLowerCase() === possibleBookName.toLowerCase());

            if (foundBook) {
                return { book: foundBook, chapter: possibleChapter };
            }
        }
        return null;
    };

    const directRef = parseBibleRef();

    // Build Display List
    let results = [];

    if (directRef) {
        results.push({
            id: 'direct-ref',
            label: `Aller à ${directRef.book} ${directRef.chapter}`,
            icon: BookOpen,
            action: () => navigate('/bible', { state: { book: directRef.book, chapter: directRef.chapter } }) // Note: BibleReader needs to handle handling state or URL params. For now we just navigate, Reader update might be needed.
        });
    }

    results = [...results, ...filteredNav];

    // Add top 5 matching books if not a direct ref match
    if (!directRef && query.length > 1) {
        results = [
            ...results,
            ...filteredBooks.slice(0, 5).map(b => ({
                id: `book-${b}`,
                label: b,
                icon: Book,
                action: () => navigate('/bible', { state: { book: b, chapter: 1 } })
            }))
        ];
    }

    const handleSelect = (index) => {
        if (results[index]) {
            results[index].action();
            setIsOpen(false);
        }
    };

    const handleKeyDownInInput = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSelect(selectedIndex);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/20 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
                {/* Search Header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
                    <Search className="text-slate-400" size={20} />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                        onKeyDown={handleKeyDownInInput}
                        placeholder="Où voulez-vous aller ? (ex: 'Jean 3', 'Calendrier'...)"
                        className="flex-1 bg-transparent text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                    <div className="hidden md:flex gap-1">
                        <kbd className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500 font-mono">ESC</kbd>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {results.length > 0 ? (
                        results.map((item, index) => (
                            <button
                                key={item.id}
                                onClick={() => handleSelect(index)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${index === selectedIndex ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <div className={`p-2 rounded-md ${index === selectedIndex ? 'bg-white shadow-sm text-accent' : 'bg-slate-100 text-slate-400'}`}>
                                    <item.icon size={18} />
                                </div>
                                <span className={`flex-1 font-medium ${index === selectedIndex ? 'font-bold' : ''}`}>
                                    {item.label}
                                </span>
                                {index === selectedIndex && <ArrowRight size={16} className="text-slate-400" />}
                            </button>
                        ))
                    ) : (
                        <div className="py-8 text-center text-slate-400">
                            <p>Aucun résultat.</p>
                        </div>
                    )}
                </div>

                {/* Footer Tips */}
                <div className="bg-slate-50 px-4 py-2 text-xs text-slate-400 border-t border-slate-100 flex justify-between">
                    <span>Pro tip: Tapez "Livre Chapitre" pour y aller directement</span>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-slate-200 rounded px-1">↑↓</kbd> Naviguer</span>
                        <span className="flex items-center gap-1"><kbd className="font-mono bg-white border border-slate-200 rounded px-1">↵</kbd> Sélectionner</span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(0,0,0,0.2); }
            `}</style>
        </div>
    );
}
