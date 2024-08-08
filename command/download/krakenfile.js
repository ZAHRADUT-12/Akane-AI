import mime from "mime-types";

export default {
  command: ["krakenfiles", "kraken", "kf"],
  description: "Download file from KrakenFiles",
  example: "Contoh: %p%cmd <KrakenFiles URL>", // %p = prefix, %cmd = command, %text = teks
  name: "krakenfiles",
  tags: "download",

  run: async (m, { conn }) => {
    const url = m.text;

    if (!func.isUrl(url))
      return m.reply(
        `Invalid URL\n\nContoh: ${m.prefix + m.command} https://krakenfiles.com/view/yZwSMqKSU7/file.html`,
      );

    await m.reply("Tunggu sebentar...");

    try {
      let response = await func.fetchJson(
        API(
          "arifzyn",
          "/download/krakenfiles",
          { url: func.isUrl(url)[0] },
          "apikey",
        ),
      );

      if (response.status !== 200) {
        return m.reply(func.format(response));
      }

      const fileUrl = response.result.url;
      const fileName = response.result.title;
      const mimeType = mime.lookup(fileName) || "application/octet-stream";

      await conn.sendMessage(m.chat, {
        document: { url: fileUrl },
        mimetype: mimeType,
        fileName: fileName,
        caption: `Title: ${response.result.title}\nUpload Date: ${response.result.uploaddate}\nLast Download Date: ${response.result.lastdownloaddate}\nFile Size: ${response.result.filesize}\nType: ${response.result.type}\nViews: ${response.result.views}\nDownloads: ${response.result.downloads}`,
      });
    } catch (err) {
      conn.logger.error(`Error fetching KrakenFiles:`, err);
      return m.reply("An error occurred while fetching the KrakenFiles.");
    }
  },
};
