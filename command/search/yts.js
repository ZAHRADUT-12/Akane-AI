import ytSearch from "yt-search";

export default {
  command: ["yts", "ytsearch"],
  description: "Search videos on YouTube",
  name: "yts",
  tags: "search",
  limit: 1,
  example: "Contoh: %p%cmd Despacito",

  run: async (m, { args }) => {
    try {
      const query = m.text;

      const searchResults = await ytSearch(query);

      const videos = searchResults.videos.slice(0, 5);

      const body = `Berikut hasil pencarian untuk "${query}":`;
      const sections = [
        {
          title: "Hasil Pencarian",
          rows: [],
        },
      ];

      videos.forEach((video, index) => {
        sections[0].rows.push({
          title: video.title,
          id: `${m.prefix}play ${video.url}`,
          description: `Durasi: ${video.timestamp}\nViews: ${video.views}`,
        });
      });

      await conn.sendListM(m.chat, body, wm, null, sections, m, {
        contextInfo: {
          mentionedJid: [m.sender],
        },
      });
    } catch (e) {
      console.error(e);
      m.reply("Terjadi kesalahan saat mencari video di YouTube.");
    }
  },
};
