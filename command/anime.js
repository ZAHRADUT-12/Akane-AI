import axios from 'axios';

const JIKAN_API_URL = 'https://api.jikan.moe/v4';

async function fetchCurrentSeasonAnime() {
    try {
        const response = await axios.get(`${JIKAN_API_URL}/seasons/now`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching current season anime:', error);
        return [];
    }
} 

async function checkForAnimeUpdates() {
    const currentSeasonAnime = await fetchCurrentSeasonAnime();
    const storedAnime = global.db.data.datas.anime || [];

    const updates = [];

    currentSeasonAnime.forEach(anime => {
        const stored = storedAnime.find(a => a.mal_id === anime.mal_id);

        if (!stored || (stored && stored.updated_at !== anime.updated_at)) {
            updates.push(anime);
            if (stored) {
                const index = storedAnime.findIndex(a => a.mal_id === anime.mal_id);
                storedAnime[index] = anime;
            } else {
                storedAnime.push(anime);
            }
        }
    });

    global.db.data.datas.anime = storedAnime;
    return updates;
}

async function sendUpdateNotifications(m, updates) {
    for (const anime of updates) {
        const message = `Anime updated: ${anime.title}\nEpisodes: ${anime.episodes}\nSynopsis: ${anime.synopsis}`;
        console.log(message); // Replace with your notification logic
        // Example: send message to a specific chat
        await m.reply(message, { from: "120363160867785242@g.us" })
    }
}

export async function before(m) {
    if (!m.body || m.body !== 'check updates') return;

    const updates = await checkForAnimeUpdates();
    
    if (updates.length > 0) {
        await sendUpdateNotifications(m, updates);
    } else {
        await m.reply('No updates found.');
    }
} 