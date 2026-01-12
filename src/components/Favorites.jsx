import { useState } from 'react';
import { useBiblePlan } from '../hooks/useBiblePlan';
import { Bookmark, Heart, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Favorites() {
    const { favorites, toggleFavorite } = useBiblePlan();
    const [page, setPage] = useState(1);
    const itemsPerPage = 9;

    // Pagination Logic
    const totalPages = Math.ceil(favorites.length / itemsPerPage);
    const paginatedFavorites = favorites.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1));
    const handlePrevPage = () => setPage(p => Math.max(1, p - 1));

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <header className="relative rounded-3xl overflow-hidden glass-panel p-8 flex items-center justify-between gap-6">
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 pointer-events-none opacity-50" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/50 border border-red-200 text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
                        <Heart size={14} className="fill-current" />
                        <span>Collection Personnelle</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-2">
                        Mes Favoris
                    </h2>
                    <p className="text-slate-500 max-w-lg">
                        Retrouvez ici les versets qui ont touché votre cœur.
                    </p>
                </div>

                <div className="hidden md:flex bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
                    <Bookmark size={32} className="text-red-400" />
                </div>
            </header>

            {/* Content */}
            <div className="min-h-[400px]">
                {favorites.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedFavorites.map((fav) => (
                                <div key={fav.id} className="group glass-card bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 relative">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleFavorite(fav)}
                                            className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                                            title="Retirer des favoris"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-slate-800 font-serif mb-1">
                                            {fav.book} {fav.chapter}:{fav.verse}
                                        </h3>
                                        <p className="text-xs text-slate-400 capitalize">
                                            {fav.savedAt ? format(new Date(fav.savedAt), 'd MMMM yyyy', { locale: fr }) : 'Non daté'}
                                        </p>
                                    </div>

                                    <blockquote className="relative p-4 bg-slate-50/50 rounded-xl">
                                        <span className="text-4xl text-slate-200 absolute top-0 left-2 font-serif">“</span>
                                        <p className="text-slate-600 font-serif leading-relaxed italic relative z-10" dangerouslySetInnerHTML={{ __html: fav.text }} />
                                    </blockquote>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 mt-8">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                >
                                    Précédent
                                </button>
                                <span className="flex items-center text-sm font-bold text-slate-500">
                                    Page {page} sur {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Heart size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Aucun favori pour le moment</h3>
                        <p className="text-slate-400 max-w-sm mx-auto">
                            Lorsque vous lisez la Bible, appuyez sur le cœur à côté d'un verset pour le sauvegarder ici.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
