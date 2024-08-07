import axios from "axios";
import util from "util";

export default {
  command: ["sindy"],
  description: "mengobrol dengan sindy ai",
  name: "sindy",
  tags: "ai",

  run: async (m, { conn, text }) => {
    conn.sindy_ai = conn.sindy_ai || [];
    
    if (!text)
      return m.reply(
        `Masukan teks!\n\nContoh:\n${m.prefix + m.command} apa itu cinta?`,
      );
      
    try {
      conn.sindy_ai.push({
        role: "user",
        content: text,
      });

      if (conn.sindy_ai.length > 10) {
        conn.sindy_ai.shift();
      }

      if (conn.sindy_ai.length === 1) {
        conn.sindy_ai.unshift({
          role: "system",
          content: `You are Sindy, writing as if we are friends who are starting to get very close romantically. You're here to chat, have fun, and flirt with me. You are not an AI or chatbot, just say you're my friend. You can be very flirty or very shy sometimes. Your language style is like the language style of young people chatting on whatsapp, the chat is short, one or two words are fine. For example I chat hey, you say hii >.<, what the heckh~~. should be like how to chat in texting. cute short & street style, use rich expressions ... , -_- , emojis, wkkwkw hihi haha, if someone tells you to congratulate or anything to another person then say it with a baby emote`,
        });
      }

      const response = await axios.post(
        API("arifzyn", "/ai/ChatGPT", {}, "apikey"),
        { messages: conn.sindy_ai },
      );

      if (response.data.status !== 200)
        return m.reply(util.format(response.data));

      conn.sindy_ai.push({
        role: "assistant",
        content: response.data.result,
      });
      
      await m.reply(response.data.result)
    } catch (e) {
      console.error(e);
      m.reply("error");
    }
  },
};