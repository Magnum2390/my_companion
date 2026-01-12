import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { BookOpen, Calendar, Layout as LayoutIcon, Settings as SettingsIcon, X, Heart, PenTool, Search, Bookmark, Settings, User } from 'lucide-react';
import CommandPalette from './CommandPalette';
import { useState } from 'react';
import { useBiblePlan } from '../hooks/useBiblePlan';

export default function Layout({ children }) {
    const { stats } = useBiblePlan();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Simulate opening Command Palette with a button click (dispatch event)
    const openCommandPalette = () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    };

    // Mapping IDs to Paths and Labels for Breadcrumbs
    const pathMap = {
        'dashboard': { path: '/', label: "Aujourd'hui" },
        'calendar': { path: '/calendrier', label: 'Plans de lecture' },
        'journal': { path: '/journal', label: 'Journal' },
        'bible': { path: '/bible', label: 'Ma Bible' },
        'favorites': { path: '/favoris', label: 'Favoris' },
        'parametres': { path: '/parametres', label: 'Paramètres' }
    };

    const currentRoute = Object.values(pathMap).find(r => r.path === location.pathname);

    const navSections = [
        {
            title: 'Principal',
            items: [
                { id: 'dashboard', label: 'Aujourd\'hui', icon: LayoutIcon, path: '/' },
                { id: 'bible', label: 'Ma Bible', icon: BookOpen, path: '/bible' },
                { id: 'calendar', label: 'Plans de lecture', icon: Calendar, path: '/calendrier' },
            ]
        },
        {
            title: 'Personnel',
            items: [
                { id: 'journal', label: 'Journal', icon: PenTool, path: '/journal' },
                { id: 'favorites', label: 'Favoris', icon: Bookmark, path: '/favoris' },
                { id: 'parametres', label: 'Paramètres', icon: Settings, path: '/parametres' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-bg-body flex flex-col text-text-main font-sans selection:bg-accent/20">
            {/* Desktop Top Navigation Bar (Floating) */}
            <header className="hidden md:flex items-center justify-between h-20 sticky top-4 mx-4 rounded-2xl glass-panel z-50 px-8 transition-all duration-300 shadow-glass">
                {/* Logo Area */}
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl overflow-hidden shadow-md border border-slate-100 bg-white">
                        <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                        <h1 className="font-serif text-xl font-bold tracking-wider text-primary-dark">
                            BIBLE <span className="text-accent">V2</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Companion</p>
                    </div>
                </div>

                {/* Search Bar Trigger */}
                <button
                    onClick={openCommandPalette}
                    className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-100 hover:border-slate-300 transition-all group ml-8 flex-1 max-w-sm cursor-text"
                >
                    <Search size={16} className="group-hover:text-accent transition-colors" />
                    <span className="text-sm font-medium">Rechercher...</span>
                    <div className="flex items-center gap-1 ml-auto">
                        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </button>

                {/* Horizontal Navigation */}
                <nav className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-white/50 backdrop-blur-sm">
                    {navSections.flatMap(section => section.items).map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-bold ${isActive
                                    ? 'bg-white text-accent shadow-sm ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-primary-dark hover:bg-white/60'
                                    }`}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        <span>{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Profile / Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold uppercase tracking-wide">
                        <span>🔥 {stats?.streak || 0} Jours</span>
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 mx-2" />

                    <NavLink to="/parametres" className="flex items-center gap-3 group cursor-pointer">
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-bold text-primary-dark group-hover:text-accent transition-colors">
                                {localStorage.getItem('user_name') || 'Invité'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">Paramètres</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:border-accent shadow-sm transition-all group-hover:scale-105">
                            <User size={20} />
                        </div>
                    </NavLink>
                </div>
            </header>

            {/* Main Content Area - Full Width Intelligent */}
            <main className="flex-1 w-full max-w-[95vw] mx-auto p-3 md:p-6 animate-in fade-in duration-500">
                {/* Breadcrumb (Mobile Only or simplified) */}
                <div className="md:hidden mb-6 flex items-center text-sm text-slate-500">
                    <span className="font-semibold text-slate-700 capitalize">
                        {currentRoute?.label || "Page"}
                    </span>
                </div>

                {children}
            </main>

            <CommandPalette />

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 flex justify-around p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-safe">
                {[
                    { id: 'dashboard', icon: LayoutIcon, label: 'Accueil', path: '/' },
                    { id: 'calendar', icon: Calendar, label: 'Plan', path: '/calendrier' },
                    { id: 'journal', icon: PenTool, label: 'Journal', path: '/journal' },
                    { id: 'bible', icon: BookOpen, label: 'Bible', path: '/bible' },
                    { id: 'menu', icon: Settings, label: 'Menu', path: '/parametres' },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-all active:scale-95 ${isActive ? 'text-accent' : 'text-slate-400'
                                }`}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`p-1 rounded-full ${isActive ? 'bg-accent/10' : ''}`}>
                                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
}
