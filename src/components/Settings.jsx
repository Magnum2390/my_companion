import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Type, Palette, Save, Upload, Trash2, Download, User, Check } from 'lucide-react';

export default function Settings() {
    const [name, setName] = useState(localStorage.getItem('user_name') || 'Invité');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
    const [accent, setAccent] = useState(localStorage.getItem('accent_color') || 'gold');
    const [fontSize, setFontSize] = useState(localStorage.getItem('font_scale') || 'normal');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Apply changes
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-accent', accent);
        // Persist
        localStorage.setItem('user_name', name);
        localStorage.setItem('theme', theme);
        localStorage.setItem('accent_color', accent);
        localStorage.setItem('font_scale', fontSize);
    }, [name, theme, accent, fontSize]);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const colors = [
        { id: 'gold', hex: '#d4af37', label: 'Or Divin' },
        { id: 'blue', hex: '#3b82f6', label: 'Bleu Céleste' },
        { id: 'rose', hex: '#f43f5e', label: 'Rose Aube' },
        { id: 'green', hex: '#10b981', label: 'Vert Espoir' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in">
            {/* Header */}
            <div className="glass-panel p-8 rounded-3xl mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-primary-dark mb-2">Paramètres</h1>
                    <p className="text-slate-500">Personnalisez votre expérience de lecture.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-primary-dark text-white px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    {saved ? <Check size={20} /> : <Save size={20} />}
                    <span>{saved ? 'Enregistré' : 'Enregistrer'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Section */}
                <section className="glass-card p-8 rounded-3xl space-y-6">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-primary-dark pb-4 border-b border-slate-100">
                        <User className="text-accent" />
                        Profil
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors">
                            <Upload size={24} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Votre Prénom</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-primary-dark focus:ring-2 focus:ring-accent outline-none transition-all"
                            />
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="glass-card p-8 rounded-3xl space-y-8">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-primary-dark pb-4 border-b border-slate-100">
                        <Palette className="text-accent" />
                        Apparence
                    </h2>

                    {/* Theme Toggle */}
                    <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Thème</label>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'light', icon: Sun, label: 'Clair' },
                                { id: 'dark', icon: Moon, label: 'Sombre' }, // Feature flag: implementation required in CSS
                                { id: 'system', icon: Monitor, label: 'Système' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setTheme(opt.id)}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === opt.id
                                            ? 'bg-primary-dark text-white border-primary-dark shadow-lg'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <opt.icon size={24} />
                                    <span className="font-medium text-sm">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accent Color */}
                    <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Couleur d'accentuation</label>
                        <div className="flex gap-4">
                            {colors.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setAccent(c.id)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${accent === c.id ? 'ring-4 ring-offset-2 ring-slate-200 scale-110' : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: c.hex }}
                                >
                                    {accent === c.id && <Check className="text-white" size={20} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Data Section */}
                <section className="glass-card p-8 rounded-3xl space-y-6">
                    <h2 className="flex items-center gap-3 text-xl font-bold text-primary-dark pb-4 border-b border-slate-100">
                        <Save className="text-accent" />
                        Données
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 px-6 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold flex items-center justify-center gap-2 transition-colors">
                            <Download size={20} />
                            Exporter mes données
                        </button>
                        <button className="flex-1 px-6 py-4 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition-colors">
                            <Trash2 size={20} />
                            Réinitialiser la progression
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
