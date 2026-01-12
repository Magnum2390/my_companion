import { useState, useEffect } from 'react';
import { biblePlan } from '../data/biblePlan';

const STORAGE_KEY = 'biblePlan2026_progress';
const JOURNAL_PREFIX = 'journal_';

export function useBiblePlan() {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    const [stats, setStats] = useState({
        totalReadings: 0,
        completedReadings: 0,
        percentage: 0,
        streak: 0
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        calculateStats();
    }, [progress]);

    const toggleReading = (id) => {
        setProgress(prev => {
            const newProgress = { ...prev };
            if (newProgress[id]) {
                delete newProgress[id];
            } else {
                newProgress[id] = new Date().toISOString(); // Store timestamp of completion
            }
            return newProgress;
        });
    };

    const isCompleted = (id) => !!progress[id];

    const calculateStats = () => {
        let total = 0;
        biblePlan.forEach(month => {
            total += month.morning.length + (month.evening ? month.evening.length : 0);
        });

        const completed = Object.keys(progress).length;

        // Calculate Streak
        let currentStreak = 0;
        const today = new Date();
        // Check for yesterday, day before, etc.
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            // Check if ANY reading has a timestamp starting with this date
            const hasReadingOnDate = Object.values(progress).some(timestamp => {
                if (!timestamp) return false;
                return timestamp.startsWith(dateStr);
            });

            if (hasReadingOnDate) {
                currentStreak++;
            } else if (i > 0) {
                // If we find a gap after today, stop counting.
                // (We allow today to be incomplete without breaking yesterday's streak)
                if (i === 0 && !hasReadingOnDate) continue;
                break;
            }
        }

        setStats({
            totalReadings: total,
            completedReadings: completed,
            percentage: Math.round((completed / total) * 100),
            streak: currentStreak
        });
    };

    // Helper to get journal content for a date
    const getJournalEntry = (dateKey) => {
        return localStorage.getItem(`${JOURNAL_PREFIX}${dateKey}`) || '';
    };

    const saveJournalEntry = (dateKey, content) => {
        localStorage.setItem(`${JOURNAL_PREFIX}${dateKey}`, content);
    };

    const getReadingsForDate = (dateParam = new Date()) => {
        const date = new Date(dateParam);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'long' });
        const day = date.getDate();

        // Capitalize month name
        const capMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        const currentMonthPlan = biblePlan.find(m => m.month === capMonth);
        if (!currentMonthPlan) return [];

        const morning = currentMonthPlan.morning.find(r => r.day === day);
        const evening = currentMonthPlan.evening ? currentMonthPlan.evening.find(r => r.day === day) : null;

        const readings = [];
        if (morning) readings.push({ ...morning, type: 'morning' });
        if (evening) readings.push({ ...evening, type: 'evening' });

        // Add completion status
        return readings.map(r => ({
            ...r,
            completed: isCompleted(r.id)
        }));
    };

    const getReadingsForToday = () => getReadingsForDate(new Date());

    // Favorites Logic
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('bible_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('bible_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (verseData) => {
        setFavorites(prev => {
            const exists = prev.some(f => f.id === verseData.id);
            if (exists) {
                return prev.filter(f => f.id !== verseData.id);
            } else {
                return [...prev, { ...verseData, savedAt: new Date().toISOString() }];
            }
        });
    };

    const isFavorite = (id) => favorites.some(f => f.id === id);

    return {
        biblePlan,
        progress,
        stats,
        favorites,
        toggleReading,
        isCompleted,
        toggleFavorite,
        isFavorite,
        getReadingsForToday,
        getReadingsForDate,
        getJournalEntry,
        saveJournalEntry
    };
}
