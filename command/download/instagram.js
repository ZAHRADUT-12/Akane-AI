export default {
  command: ["instagram", "ig"],
  description: "Download Instagram reel/video/image",
  example: "Contoh: %p%cmd <Instagram URL>", // %p = prefix, %cmd = command, %text = teks
  name: "instagram",
  tags: "download",

  run: async (m, { conn }) => {
    const url = m.text;

    if (!func.isUrl(url))
      return m.reply(
        `Invalid URL\n\nContoh: ${m.prefix + m.command} https://www.instagram.com/reel/C65wgBxraJ5/`,
      );

    await m.reply("wait");

    let response;

    try {
      response = await func.fetchJson(
        `https://dikaardnt.com/api/download/instagram?url=${func.isUrl(url)[0]}`,
      );
    } catch (err) {
      conn.logger.error(`Error fetching Instagram reel:`, err);
      return m.reply("An error occurred while fetching the Instagram reel.");
    }

    if (response.length === 0) {
      return m.reply("Failed to fetch Instagram reel/video/image.");
    }

    for (const mediaUrl of response) {
      try {
        await m.reply(mediaUrl, {
          caption: `Here is your Instagram download.`,
        });
      } catch (err) {
        conn.logger.error(`Error sending media:`, err);
        m.reply(`error`);
      }
    }
  },
};
