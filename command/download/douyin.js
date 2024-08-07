export default {
  command: ["douyin", "dy"],
  description: "Download Douyin video",
  example: "Contoh: %p%cmd <Douyin URL>", // %p = prefix, %cmd = command, %text = teks
  name: "douyin",
  tags: "download",

  run: async (m, { conn }) => {
    const url = m.text;

    if (!func.isUrl(url))
      return m.reply(
        `Invalid URL\n\nContoh: ${m.prefix + m.command} https://v.douyin.com/iMt2SMvj/`,
      );

    await m.reply("Tunggu sebentar...");

    try {
      let response = await func.fetchJson(
        API("arifzyn", "/download/douyin", { url: func.isUrl(url)[0] }, "apikey"),
      );

      if (response.status !== 200) {
        return m.reply(func.format(response));
      }

      await m.reply(response?.result?.medias[0]?.url, {
        caption: `Title: ${response.result.title}\nDuration: ${response.result.duration}\nSource: ${response.result.source}`,
      });
    } catch (err) {
      conn.logger.error(`Error fetching Douyin video:`, err);
      return m.reply("An error occurred while fetching the Douyin video.");
    }
  },
};