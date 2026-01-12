export const spiritualImages = [
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop", // Mountains / Clouds
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop", // Nature fog
    "https://images.unsplash.com/photo-1519681393798-38e43269d499?q=80&w=2070&auto=format&fit=crop", // Starry sky
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop", // Beach sunrise
    "https://images.unsplash.com/photo-1519750566772-1b19fb42fa05?q=80&w=2074&auto=format&fit=crop", // Prayer / Light
    "https://images.unsplash.com/photo-1499209974431-9bbb4ab98022?q=80&w=2076&auto=format&fit=crop", // Landscape
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop", // Light rays
];

export const getRandomImage = () => {
    return spiritualImages[Math.floor(Math.random() * spiritualImages.length)];
};

export const getDailyImage = () => {
    // Deterministic image based on day of year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return spiritualImages[dayOfYear % spiritualImages.length];
};
