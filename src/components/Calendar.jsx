import { useState } from 'react';
import { useBiblePlan } from '../hooks/useBiblePlan';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Calendar as CalendarIcon, Star } from 'lucide-react';

export default function Calendar() {
    const { biblePlan, isCompleted, toggleReading, stats } = useBiblePlan();

    // Auto-expand current month
    const currentMonthIndex = new Date().getMonth();
    const [expandedMonth, setExpandedMonth] = useState(currentMonthIndex);

    return (
        <div className="space-y-8 animate-in pb-20">
            {/* Header / Hero */}
            <header className="relative rounded-3xl overflow-hidden glass-panel p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/5 to-accent/5 pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-bold uppercase tracking-widest text-accent-dark mb-3">
                        <CalendarIcon size={14} />
                        <span>Vue d'ensemble 2026</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-dark mb-2">
                        Plan de Lecture
                    </h2>
                    <p className="text-slate-500 max-w-lg">
                        Suivez votre progression à travers la Bible, mois par mois.
                    </p>
                </div>

                {/* Global Progress */}
                <div className="glass-card p-4 rounded-2xl flex items-center gap-4 bg-white/50 backdrop-blur-md border hover:scale-105 transition-transform">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-slate-200"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-accent drop-shadow-md"
                                strokeDasharray={`${stats.percentage}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <span className="absolute text-xs font-bold text-primary-dark">{stats.percentage}%</span>
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-bold font-serif text-primary-dark">{stats.completedReadings}</div>
                        <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Chapitres Lus</div>
                    </div>
                </div>
            </header>

            {/* Months Grid - Intelligent Response */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {biblePlan.map((monthData, index) => {
                    const isExpanded = expandedMonth === index;
                    const isCurrent = index === currentMonthIndex;

                    // Calculate progress
                    const totalItems = monthData.morning.length + (monthData.evening ? monthData.evening.length : 0);
                    const completedItems = [...monthData.morning, ...(monthData.evening || [])]
                        .filter(item => isCompleted(item.id)).length;
                    const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
                    const isDone = progress === 100;

                    return (
                        <div
                            key={index}
                            className={`group rounded-3xl transition-all duration-300 overflow-hidden ${isExpanded
                                ? 'bg-white/90 shadow-glass ring-2 ring-accent/20 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2 row-span-2' // Intelligent span
                                : 'glass-card bg-white/40 hover:bg-white/60'
                                }`}
                        >
                            {/* Card Header */}
                            <button
                                onClick={() => setExpandedMonth(isExpanded ? null : index)}
                                className="w-full relative overflow-hidden p-6 flex flex-col items-stretch"
                            >
                                {/* Background Progress Bar (Subtle) */}
                                <div
                                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-accent-light opacity-50 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif text-xl font-bold transition-colors ${isDone ? 'bg-green-100 text-green-700' :
                                            isCurrent ? 'bg-primary-dark text-white shadow-lg' :
                                                'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="text-left">
                                            <h3 className={`font-serif text-xl font-bold transition-colors ${isCurrent ? 'text-primary-dark' : 'text-slate-700'}`}>
                                                {monthData.month}
                                            </h3>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                {monthData.subtitle || `${totalItems} Chapitres`}
                                                {isDone && <CheckCircle2 size={12} className="text-green-500" />}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`text-sm font-bold ${isDone ? 'text-green-600' : 'text-slate-400'}`}>
                                            {progress}%
                                        </span>
                                        <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-slate-100 rotate-180' : 'bg-transparent group-hover:bg-slate-100'}`}>
                                            <ChevronDown size={20} className="text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="p-6 pt-0 border-t border-slate-100/50 animate-in slide-in-from-top-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                        {/* Morning */}
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-accent-dark uppercase tracking-widest mb-4 opacity-70">
                                                <SunriseIcon /> Matin
                                            </h4>
                                            <div className="space-y-2">
                                                {monthData.morning.map(item => (
                                                    <ReadingItem
                                                        key={item.id}
                                                        item={item}
                                                        isCompleted={isCompleted(item.id)}
                                                        onToggle={() => toggleReading(item.id)}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Evening */}
                                        {monthData.evening && (
                                            <div className="space-y-4">
                                                <h4 className="flex items-center gap-2 text-xs font-bold text-primary-light uppercase tracking-widest mb-4 opacity-70">
                                                    <MoonIcon /> Soir
                                                </h4>
                                                <div className="space-y-2">
                                                    {monthData.evening.map(item => (
                                                        <ReadingItem
                                                            key={item.id}
                                                            item={item}
                                                            isCompleted={isCompleted(item.id)}
                                                            onToggle={() => toggleReading(item.id)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Subcomponents for Icons and Items
const SunriseIcon = () => (
    <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

function ReadingItem({ item, isCompleted, onToggle }) {
    // Parse Label: "15 jan: Genèse 1-3" -> Date: "15 jan", Ref: "Genèse 1-3"
    const [datePart, refPart] = item.label.includes(':')
        ? item.label.split(':')
        : ["Jour", item.label];

    return (
        <div
            onClick={onToggle}
            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${isCompleted
                ? 'bg-slate-50 border-transparent opacity-60 hover:opacity-100'
                : 'bg-white border-slate-100 hover:border-accent/30 hover:shadow-sm hover:-translate-y-0.5'
                }`}
        >
            <div className={`min-w-[20px] h-5 rounded-full border-2 flex items-center justify-center transition-all ${isCompleted
                ? 'bg-accent border-accent text-white'
                : 'border-slate-300 text-transparent group-hover:border-accent'
                }`}>
                <CheckCircle2 size={12} strokeWidth={4} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-sm font-bold font-serif truncate ${isCompleted ? 'text-slate-500 line-through decoration-accent/50' : 'text-primary-dark'}`}>
                        {refPart.trim()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider whitespace-nowrap">
                        {datePart.trim()}
                    </span>
                </div>
            </div>
        </div>
    );
}
