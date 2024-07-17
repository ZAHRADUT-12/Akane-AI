import yts from "yt-search";
import ytdl from "ytdl-core";

export default {
  command: ["play"],
  description: "Play a video or search and play from YouTube",
  name: "play",
  tags: "download",

  example:
    "[!] Silakan masukkan URL atau query pencarian.\n\nContoh: %p%cmd one day",

  run: async (m, { conn }) => {
    try {
      let url;

      if (!func.isUrl(m.text)) {
        let search = await yts(m.text);
        if (!search || !search.videos.length) {
          throw `Tidak dapat menemukan hasil untuk *${m.text}*`;
        }
        url = search.videos[0].url;
      } else {
        url = m.text;
      }

      let videoInfo = await yts(url);
      videoInfo = videoInfo.all[0];

      let txt = `📌 *${videoInfo.title}*\n\n`;
      txt += `🪶 *Author :* ${videoInfo.author.name}\n`;
      txt += `⏲️ *Published :* ${videoInfo.uploadDate}\n`;
      txt += `👁️ *Views :* ${videoInfo.views}\n`;
      txt += `🌀 *Url :* ${url}\n\n`;
      txt += `Click di bawah untuk download video/audio.`;

      await conn.sendQuick(
        m.chat,
        txt,
        wm,
        videoInfo.image,
        [
          ["Video", `${m.prefix}ytmp4 ${url}`],
          ["Audio", `${m.prefix}ytmp3 ${url}`],
        ],
        m,
      );
    } catch (e) {
      console.error(e);
      m.reply("Terjadi kesalahan saat memproses permintaan play audio.");
    }
  },
};
