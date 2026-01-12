import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBiblePlan } from '../hooks/useBiblePlan';
import { Save, Calendar as CalendarIcon, ChevronLeft, ChevronRight, PenTool, Sparkles, Quote, CheckCircle2 } from 'lucide-react';

export default function Journal() {
    const { getJournalEntry, saveJournalEntry } = useBiblePlan();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Derive key from date (YYYY-MM-DD)
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const displayDate = format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr });
    const shortDate = format(selectedDate, 'd MMMM', { locale: fr });

    // Load entry when date changes
    useEffect(() => {
        const saved = getJournalEntry(dateKey);
        setContent(saved || '');
    }, [dateKey]);

    // Auto-save debounced
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (content) {
                setIsSaving(true);
                saveJournalEntry(dateKey, content);
                setTimeout(() => setIsSaving(false), 1000);
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [content, dateKey]);

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header / Hero */}
            <header className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50/50 pointer-events-none" />

                <div className="relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 border border-indigo-200 text-xs font-bold uppercase tracking-widest text-indigo-700 mb-4">
                        <PenTool size={14} />
                        <span>Espace de Réflexion</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4">
                        Journal Spirituel
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
                        Écrivez vos pensées, vos prières et ce que Dieu vous inspire aujourd'hui.
                    </p>
                </div>

                {/* Daily Prompt / Inspiration Card */}
                <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 max-w-sm w-full -rotate-1 hover:rotate-0 transition-transform duration-300 hidden md:block">
                    <Quote className="absolute top-4 left-4 text-indigo-100 fill-current" size={48} />
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles size={14} /> Pensée du jour
                        </h3>
                        <p className="text-slate-700 font-serif italic text-lg leading-relaxed">
                            "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier."
                        </p>
                        <p className="text-right text-xs font-bold text-slate-400 mt-3">— Psaume 119:105</p>
                    </div>
                </div>
            </header>

            {/* Main Editor Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full min-h-[600px]">

                {/* Left Sidebar: Date Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Navigation</h3>

                        <div className="flex flex-row lg:flex-col gap-4 items-center sm:justify-between lg:justify-start">
                            <button
                                onClick={() => changeDate(-1)}
                                className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all group flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold text-sm hidden lg:inline">Précédent</span>
                            </button>

                            <div className="text-center py-2 lg:py-4">
                                <div className="text-3xl font-bold text-slate-800 font-serif">{format(selectedDate, 'd')}</div>
                                <div className="text-sm font-medium text-accent uppercase tracking-widest">{format(selectedDate, 'MMM yyyy', { locale: fr })}</div>
                            </div>

                            <button
                                onClick={() => changeDate(1)}
                                className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all group flex items-center justify-center gap-2"
                            >
                                <span className="font-semibold text-sm hidden lg:inline">Suivant</span>
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 hidden lg:block">
                            <div className="flex items-center gap-3 text-sm text-green-600 bg-green-50 p-3 rounded-lg opacity-0 data-[show=true]:opacity-100 transition-opacity" data-show={isSaving}>
                                <CheckCircle2 size={16} />
                                <span className="font-medium">Sauvegardé</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Area: The Editor */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 h-full flex flex-col overflow-hidden relative group">
                        {/* Editor Header */}
                        <div className="bg-slate-50/50 border-b border-slate-100 p-6 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <CalendarIcon size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 capitalize">
                                    {displayDate}
                                </h3>
                            </div>
                            <div className="lg:hidden text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full transition-opacity" style={{ opacity: isSaving ? 1 : 0 }}>
                                Sauvegardé
                            </div>
                        </div>

                        {/* Text Area */}
                        <div className="flex-1 relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Commencez à écrire ici... Qu'avez-vous retenu de votre lecture aujourd'hui ?"
                                className="absolute inset-0 w-full h-full p-8 resize-none focus:outline-none font-serif text-lg md:text-xl leading-loose text-slate-700 placeholder:text-slate-300 placeholder:font-sans placeholder:italic"
                                style={{
                                    backgroundImage: 'linear-gradient(transparent, transparent 39px, #e2e8f0 39px, #e2e8f0 40px)',
                                    backgroundSize: '100% 40px',
                                    lineHeight: '40px',
                                    backgroundAttachment: 'local'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

