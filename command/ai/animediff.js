export default {
  command: ["animediff"],
  description: "membuat gambar anime",
  name: "animediff",
  tags: "ai",

  run: async (m, { conn, text }) => {
    if (!text)
      return m.reply(
        `Masukan prompt!\n\nContoh:\n${m.prefix + m.command} cute, long hair`,
      );

    try {
      const result = API(
        "arifzyn",
        "/ai/animediff",
        { prompt: text },
        "apikey",
      );

      await m.reply(result);
    } catch (error) {
      await m.reply(func.format(error?.response?.data));
    }
  },
};
