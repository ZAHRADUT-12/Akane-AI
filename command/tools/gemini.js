import GeminiAI from "../../storage/scraper/gemini.js";

const gemini = new GeminiAI("AIzaSyDYEhk9stqfq1cvzdjBRiK1-Axxkb79y54");

export default {
  command: ["gemini", "gemini-ai"],
  description: "Chat AI with Gemini Google",
  name: "gemini",
  tags: "tools",

  example: "Contoh : %p%cmd Hai Gemini",

  run: async (m, { conn }) => {
    const prompt = m.text;
    const quoted = m.isQuoted ? m.quoted : m;

    try {
      let response;
      if (quoted.mime && /image/i.test(quoted.mime)) {
        const path = await quoted.download();
        const mimeType = quoted.mime;
        response = await gemini.runGeminiVision(prompt, path, mimeType);
      } else {
        response = await gemini.runGeminiPro(prompt);
      }

      await m.reply(response);
    } catch (error) {
      console.error("Error running Gemini AI:", error);
      await conn.sendMessage(
        m.chat,
        "There was an error processing your request.",
        { quoted: m },
      );
    }
  },
};
