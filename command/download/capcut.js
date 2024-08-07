export default {
  command: ["capcut", "cc"],
  description: "Download Capcut video",
  example: "Contoh: %p%cmd <Capcut URL>", // %p = prefix, %cmd = command, %text = teks
  name: "capcut",
  tags: "download",

  run: async (m, { conn }) => {
    const url = m.text;

    if (!func.isUrl(url))
      return m.reply(
        `Invalid URL\n\nContoh: ${m.prefix + m.command} https://www.capcut.com/template-detail/7049285800688667905`,
      );

    await m.reply("Tunggu sebentar...");

    try {
      let response = await func.fetchJson(
        API("arifzyn", "/download/capcut", { url: func.isUrl(url)[0] }, "apikey"),
      );

      if (response.status !== 200) {
        return m.reply(func.format(response));
      }

      await m.reply(response?.result?.url, {
        caption: `Title: ${response.result.title}\nAction: ${response.result.action}\nAuthor: ${response.result.author.name}\nDescription: ${response.result.author.desc}`
      });
    } catch (err) {
      conn.logger.error(`Error fetching Capcut video:`, err);
      return m.reply("An error occurred while fetching the Capcut video.");
    }
  },
};