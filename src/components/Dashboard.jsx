import { useState, useEffect } from 'react';
import { BookOpen, Calendar, ArrowRight, CheckCircle2, CloudFog, Sunrise, Moon, Sparkles, Trophy, Flame, Target } from 'lucide-react';
import { useBiblePlan } from '../hooks/useBiblePlan';
import { useNavigate } from 'react-router-dom';
import { getDailyImage } from '../services/imageService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Dashboard() {
    const { getReadingsForToday, toggleReading, stats } = useBiblePlan();
    const readings = getReadingsForToday();
    const navigate = useNavigate();
    const bgImage = getDailyImage();

    // Time-based greeting
    const hour = new Date().getHours();
    const isMorning = hour < 12;
    const greeting = isMorning ? "Bonjour" : (hour < 18 ? "Bon après-midi" : "Bonsoir");
    const GreetingIcon = isMorning ? Sunrise : Moon;
    const userName = localStorage.getItem('user_name') || 'Invité';

    const completedCount = readings.filter(r => r.completed).length;
    const totalCount = readings.length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return (
        <div className="space-y-6 animate-in pb-24">
            {/* Header Compact - Horizontal Layout */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    {/* Circular Date Badge */}
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 shrink-0">
                        <span className="text-xs font-bold uppercase text-red-500">{format(new Date(), 'MMM', { locale: fr })}</span>
                        <span className="text-xl font-serif font-bold text-slate-800">{format(new Date(), 'd')}</span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                            <GreetingIcon size={12} className="text-accent" />
                            {greeting}
                        </div>
                        <h1 className="font-serif text-2xl font-bold text-slate-800">
                            {userName}
                        </h1>
                    </div>
                </div>

                {/* Quick Stats Strip */}
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-full text-orange-500">
                            <Flame size={18} className="fill-current" />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-slate-800 leading-none">{stats.streak}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Jours</div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-100" />

                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-full text-blue-500">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <div className="text-lg font-bold text-slate-800 leading-none">{progress}%</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Fait</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Readings Column */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen size={18} className="text-slate-400" />
                                À lire aujourd'hui
                            </h2>
                            <span className="text-xs font-bold bg-white px-2 py-1 rounded text-slate-400 shadow-sm border border-slate-100">
                                {completedCount}/{totalCount}
                            </span>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {readings.length > 0 ? (
                                readings.map((reading) => (
                                    <div
                                        key={reading.id}
                                        onClick={() => toggleReading(reading.id)}
                                        className={`group p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${reading.completed ? 'opacity-50' : ''}`}
                                    >
                                        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${reading.completed
                                                ? 'bg-accent border-accent text-white'
                                                : 'border-slate-300 text-transparent group-hover:border-accent'
                                            }`}>
                                            <CheckCircle2 size={14} strokeWidth={3} />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className={`text-base font-medium transition-colors ${reading.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                                {reading.label.split(':')[1]?.trim() || reading.label}
                                            </h3>
                                            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                                                {reading.label.split(':')[0]}
                                            </p>
                                        </div>

                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <CloudFog className="mx-auto text-slate-300 mb-2" size={32} />
                                    <span className="text-sm text-slate-500 font-medium">Tout est calme aujourd'hui.</span>
                                </div>
                            )}
                        </div>

                        {readings.length > 0 && (
                            <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
                                <button
                                    onClick={() => navigate('/bible')}
                                    className="text-sm font-bold text-accent hover:text-accent-dark transition-colors"
                                >
                                    Ouvrir la Bible &rarr;
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Widget - Just the Essential */}
                <div className="lg:col-span-1">
                    <div className="rounded-3xl p-6 bg-slate-900 text-white relative overflow-hidden group h-full min-h-[200px] flex flex-col justify-center text-center">
                        <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
                        <Sparkles className="mx-auto text-yellow-400 mb-4 opacity-80" size={24} />
                        <blockquote className="font-serif text-lg italic opacity-90 relative z-10">
                            "Ta parole est une lampe à mes pieds."
                        </blockquote>
                        <cite className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 relative z-10 not-italic">
                            Psaume 119:105
                        </cite>
                    </div>
                </div>
            </div>
        </div>
    );
}
