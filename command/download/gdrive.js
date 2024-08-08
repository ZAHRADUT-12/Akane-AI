import mime from "mime-types";

export default {
  command: ["gdrive", "drive"],
  description: "Download file from Google Drive",
  example: "Contoh: %p%cmd <Google Drive URL>", // %p = prefix, %cmd = command, %text = teks
  name: "gdrive",
  tags: "download",

  run: async (m, { conn }) => {
    const url = m.text;

    if (!func.isUrl(url))
      return m.reply(
        `Invalid URL\n\nContoh: ${m.prefix + m.command} https://drive.google.com/file/d/1T1XFatQVZ1exnyb6cXOJN9r0RJoYepDt/view`,
      );

    await m.reply("Tunggu sebentar...");

    try {
      let response = await func.fetchJson(
        API(
          "arifzyn",
          "/download/gdrive",
          { url: func.isUrl(url)[0] },
          "apikey",
        ),
      );

      if (response.status !== 200) {
        return m.reply(func.format(response));
      }

      const fileUrl = response.result.downloadUrl;
      const fileName = response.result.fileName;
      const mimeType =
        response.result.mimetype ||
        mime.lookup(fileName) ||
        "application/octet-stream";

      await conn.sendMessage(m.chat, {
        document: { url: fileUrl },
        mimetype: mimeType,
        fileName: fileName,
        caption: `File Name: ${response.result.fileName}\nFile Size: ${(response.result.fileSize / (1024 * 1024)).toFixed(2)} MB\nMimetype: ${response.result.mimetype}`,
      });
    } catch (err) {
      conn.logger.error(`Error fetching Google Drive file:`, err);
      return m.reply("An error occurred while fetching the Google Drive file.");
    }
  },
};
