export default {
  command: ["ai"],
  description: "Mengirim pesan ke ChatGPT dan mendapatkan balasan",
  name: "ai",
  tags: "ai",

  run: async (m, { conn, text }) => {
    if (!text)
      return m.reply(
        `Masukan text!\n\nContoh:\n${m.prefix + m.command} apa itu cinta?`,
      );

    try {
      const result = await func.fetchJson(
        API("arifzyn", "/ai/chatgpt-completions", { text: text }, "apikey"),
      );
      conn.reply(m.chat, result.result.trim(), m);
    } catch (error) {
      m.reply(func.format(error?.response?.data));
    }
  },
};
