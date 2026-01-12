// Helper to distribute chapters over days
function generateDailyReadings(month, year, startDay, endDay, textRange, idPrefix, time = 'morning') {
    const readings = [];
    const daysCount = endDay - startDay + 1;

    // 1. Parse all segments in the textRange
    // Expected format: "Book A 1-10, Book B 1-5, Book C 5-10"
    // We split by comma first.
    const segments = textRange.split(',').map(s => s.trim());

    // We need to flatten this into a list of "Absolute Chapter Units"
    // e.g. [{book: "Genèse", chap: 1}, {book: "Genèse", chap: 2}...]
    let allChapters = [];

    // Regex to parse "BookName 1-20" or "BookName 5"
    // Handles "1 Samuel", "Chant des chants", etc.
    const partRegex = /^(.+?)\s+(\d+)(?:-(\d+))?$/;

    segments.forEach(seg => {
        const match = seg.match(partRegex);
        if (match) {
            const bookName = match[1];
            const startC = parseInt(match[2]);
            const endC = match[3] ? parseInt(match[3]) : startC;

            for (let c = startC; c <= endC; c++) {
                allChapters.push({ book: bookName, chap: c });
            }
        } else {
            // Fallback: If we can't parse "Job 1-42", maybe it's just "Job" (implying all?)
            // Or complex string. We push a placeholder unit.
            // For this specific app/data, we assume clean format provided or we'll have issues.
            // We'll treat it as a single unit "read" if parsing fails, to avoid crash.
            allChapters.push({ book: seg, chap: null });
        }
    });

    const totalChapters = allChapters.length;

    // If we have 0 chapters parsed (error), fallback to splitting the text
    if (totalChapters === 0) {
        for (let i = 0; i < daysCount; i++) {
            const currentDay = startDay + i;
            readings.push({
                day: currentDay,
                label: `${currentDay} ${month.slice(0, 3).toLowerCase()}: ${textRange} (J${i + 1})`,
                id: `${idPrefix}-${currentDay}`
            });
        }
        return readings;
    }

    // 2. Distribute these units over the days
    const chapsPerDay = totalChapters / daysCount;
    let currentUnitIndex = 0;

    for (let i = 0; i < daysCount; i++) {
        const currentDay = startDay + i;

        // Calculate end index for today
        const nextIndex = Math.round((i + 1) * chapsPerDay);

        // Start is currentUnitIndex. 
        // End is nextIndex - 1 (inclusive), camped to total - 1
        let endIndex = nextIndex - 1;
        if (i === daysCount - 1) endIndex = totalChapters - 1; // Force finish on last day
        if (endIndex >= totalChapters) endIndex = totalChapters - 1;

        // Gather the reading text for today
        // It could span multiple books. e.g. "Gen 50" to "Exode 2"

        let label = "";

        if (currentUnitIndex > endIndex && currentUnitIndex >= totalChapters) {
            // We finished everything early (rounding error?). show last one again.
            const last = allChapters[totalChapters - 1];
            label = `${currentDay} ${month.slice(0, 3).toLowerCase()}: ${last.book} ${last.chap || ''} (Fin)`;
        } else {
            // Normal range
            // If start > end (because clamped), we just take start.
            const s = Math.min(currentUnitIndex, endIndex);
            const e = Math.max(s, endIndex);

            const selectedUnits = allChapters.slice(s, e + 1);

            // Group by book
            const groups = [];
            if (selectedUnits.length > 0) {
                let currentGroup = { book: selectedUnits[0].book, start: selectedUnits[0].chap, end: selectedUnits[0].chap };

                for (let k = 1; k < selectedUnits.length; k++) {
                    const u = selectedUnits[k];
                    if (u.book === currentGroup.book) {
                        currentGroup.end = u.chap;
                    } else {
                        groups.push(currentGroup);
                        currentGroup = { book: u.book, start: u.chap, end: u.chap };
                    }
                }
                groups.push(currentGroup);
            }

            // Format groups
            const textParts = groups.map(g => {
                if (g.start === null) return g.book; // Fallback
                return (g.start === g.end) ? `${g.book} ${g.start}` : `${g.book} ${g.start}-${g.end}`;
            });

            label = `${currentDay} ${month.slice(0, 3).toLowerCase()}: ${textParts.join(', ')}`;
        }

        readings.push({
            day: currentDay,
            label: label,
            id: `${idPrefix}-${currentDay}`
        });

        // Advance cursor
        currentUnitIndex = endIndex + 1;
    }

    return readings;
}

export const biblePlan = [
    {
        month: "Janvier",
        year: 2026,
        subtitle: "(13-31 janvier)",
        morning: [
            ...generateDailyReadings("Janvier", 2026, 13, 15, "Genèse 1-9", "jan-m-1"),
            ...generateDailyReadings("Janvier", 2026, 16, 18, "Genèse 10-18", "jan-m-2"),
            ...generateDailyReadings("Janvier", 2026, 19, 21, "Genèse 19-27", "jan-m-3"),
            ...generateDailyReadings("Janvier", 2026, 22, 24, "Genèse 28-36", "jan-m-4"),
            ...generateDailyReadings("Janvier", 2026, 25, 27, "Genèse 37-45", "jan-m-5"),
            { day: 28, label: "28 jan: Genèse 46-48", id: "jan-m-6-28" },
            { day: 29, label: "29 jan: Genèse 49-50", id: "jan-m-6-29" },
            { day: 30, label: "30 jan: Exode 1-2", id: "jan-m-6-30" },
            { day: 31, label: "31 jan: Exode 3", id: "jan-m-6-31" },
        ],
        evening: [
            ...generateDailyReadings("Janvier", 2026, 13, 31, "Matthieu 1-19", "jan-e")
        ]
    },
    {
        month: "Février",
        year: 2026,
        morning: [
            ...generateDailyReadings("Février", 2026, 1, 28, "Exode 4-40, Lévitique 1-17", "feb-m")
        ],
        evening: [
            ...generateDailyReadings("Février", 2026, 1, 28, "Matthieu 20-28, Marc 1-16", "feb-e")
        ]
    },
    {
        month: "Mars",
        year: 2026,
        morning: [
            ...generateDailyReadings("Mars", 2026, 1, 31, "Lévitique 18-27, Nombres 1-36", "mar-m")
        ],
        evening: [
            ...generateDailyReadings("Mars", 2026, 1, 31, "Luc 1-24", "mar-e")
        ]
    },
    {
        month: "Avril",
        year: 2026,
        morning: [
            ...generateDailyReadings("Avril", 2026, 1, 30, "Deutéronome 1-34, Josué 1-24", "apr-m")
        ],
        evening: [
            ...generateDailyReadings("Avril", 2026, 1, 30, "Jean 1-21", "apr-e")
        ]
    },
    {
        month: "Mai",
        year: 2026,
        morning: [
            ...generateDailyReadings("Mai", 2026, 1, 31, "Juges 1-21, Ruth 1-4, 1 Samuel 1-19", "may-m")
        ],
        evening: [
            ...generateDailyReadings("Mai", 2026, 1, 31, "Actes 1-28", "may-e")
        ]
    },
    {
        month: "Juin",
        year: 2026,
        morning: [
            ...generateDailyReadings("Juin", 2026, 1, 30, "1 Samuel 20-31, 2 Samuel 1-24, 1 Rois 1-9", "jun-m")
        ],
        evening: [
            ...generateDailyReadings("Juin", 2026, 1, 30, "Romains 1-16, 1 Corinthiens 1-16", "jun-e")
        ]
    },
    {
        month: "Juillet",
        year: 2026,
        morning: [
            ...generateDailyReadings("Juillet", 2026, 1, 31, "1 Rois 10-22, 2 Rois 1-25, 1 Chroniques 1-4", "jul-m")
        ],
        evening: [
            ...generateDailyReadings("Juillet", 2026, 1, 31, "1 Cor 11-16, 2 Cor 1-13, Gal 1-6, Éph 1-6, Phil 1-4", "jul-e")
        ]
    },
    {
        month: "Août",
        year: 2026,
        morning: [
            ...generateDailyReadings("Août", 2026, 1, 31, "1 Chroniques 5-29, 2 Chroniques 1-36", "aug-m")
        ],
        evening: [
            ...generateDailyReadings("Août", 2026, 1, 31, "Col 1-4, 1+2 Thes, 1+2 Tim, Tite, Philémon, Hébreux", "aug-e")
        ]
    },
    {
        month: "Septembre",
        year: 2026,
        morning: [
            ...generateDailyReadings("Septembre", 2026, 1, 30, "Esdras, Néhémie, Esther, Job", "sep-m")
        ],
        evening: [
            ...generateDailyReadings("Septembre", 2026, 1, 30, "Jacques, 1+2 Pierre, 1+2+3 Jean, Jude, Apoc 1-14", "sep-e")
        ]
    },
    {
        month: "Octobre",
        year: 2026,
        morning: [
            ...generateDailyReadings("Octobre", 2026, 1, 31, "Psaumes 1-93", "oct-m")
        ],
        evening: [
            ...generateDailyReadings("Octobre", 2026, 1, 31, "Apocalypse 15-22, Révision NT", "oct-e")
        ]
    },
    {
        month: "Novembre",
        year: 2026,
        morning: [
            ...generateDailyReadings("Novembre", 2026, 1, 30, "Psaumes 94-150, Proverbes 1-31", "nov-m")
        ],
        evening: [
            ...generateDailyReadings("Novembre", 2026, 1, 30, "Révision Nouveau Testament", "nov-e")
        ]
    },
    {
        month: "Décembre",
        year: 2026,
        morning: [
            ...generateDailyReadings("Décembre", 2026, 1, 31, "Ecclésiaste, Cantique, Ésaïe", "dec-m")
        ],
        evening: [
            ...generateDailyReadings("Décembre", 2026, 1, 31, "Jérémie 1-31", "dec-e")
        ]
    }
];
