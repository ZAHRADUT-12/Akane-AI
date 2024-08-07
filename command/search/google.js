import googleIt from "google-it";

export default {
  command: ["google"],
  name: "google",
  tags: "search",
  limit: true,

  run: async (m, { conn, text }) => {
    if (!text) return m.reply(`Contoh: ${m.prefix + m.command} cara bikin bot`);

    try {
      let results = await googleIt({ query: text });
      if (results.length === 0) throw "Tidak ada hasil ditemukan.";

      let txt = `Hasil pencarian untuk: *${text}*`;
      results.forEach((result) => {
        txt += `\n\n*${result.title}*\n${result.link}\n_${result.snippet}_\n───────────────────`;
      });

      await m.reply(txt);
    } catch (error) {
      await m.reply(`Terjadi kesalahan: ${error}`);
    }
  },
};
