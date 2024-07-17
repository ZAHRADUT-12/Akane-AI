import axios from "axios";
import fetch from "node-fetch";
import cheerio from "cheerio";
import natural from "natural";
import { areJidsSameUser } from "@whiskeysockets/baileys";

export async function before(m) {
  let user = global.db.data.users[m.sender]
    ? global.db.data.users[m.sender].openai
    : null;
  let isCmd = m.body.startsWith(m.prefix);

  if (m.isBaileys) return;
  if (!m.quoted || !m.quoted.key || !m.quoted.key.fromMe) return;

  if (checkImageCommand(m.body)) {
    const query = extractImageQuery(m.body);

    m.reply(
      `Oke, tunggu sebentar ya~ akane sedang mencari gambar "${query}" untukmu!`,
    );

    try {
      const response = await func.fetchJson(
        API("itzpire", "/search/pinterest", { query }),
      );

      if (!response || response.status !== "success" || !response.data) {
        return m.reply("Maaf, terjadi kesalahan dalam mencari gambar. -_");
      }

      const images = response.data;

      if (images.length > 0) {
        const imageUrl = images[Math.floor(Math.random() * images.length)];

        await conn.sendQuick(
          m.chat,
          `Berikut adalah gambar yang kamu cari: ${query}`,
          wm,
          imageUrl,
          [["Next", `.pinterest ${query}`]],
          m,
        );
      } else {
        m.reply(`Maaf, tidak dapat menemukan gambar untuk "${query}".`);
      }
    } catch (e) {
      console.error(e);
      m.reply(`Maaf, terjadi kesalahan dalam mencari gambar.`);
    }
  } else if (checkText(m.body) === "ok") {
    async function findSong(text) {
      const tokenizer = new natural.WordTokenizer();
      const tokens = tokenizer.tokenize(text.toLowerCase());

      const keywords = [
        "putar",
        "putarkan",
        "putarlagu",
        "lagu",
        "cariin",
        "carikan",
        "mainkan",
        "mainkanlagu",
        "play",
        "playmusic",
        "playasong",
      ];
      const songKeywords = tokens.filter((token) => keywords.includes(token));

      if (songKeywords.length === 0) {
        return "Maaf, tidak dapat menemukan permintaan lagu dalam teks tersebut.";
      }

      let songTitle = tokens
        .slice(tokens.indexOf(songKeywords[0]) + 1)
        .join(" ");

      return songTitle;
    }

    const songName = await findSong(m.body);

    m.reply(
      `Oke, tunggu sebentar ya~ akane sedang mencari "${songName}" untukmu!`,
    );

    try {
      let response1 = await axios.get(
        `https://spotifyapi.caliphdev.com/api/search/tracks?q=${encodeURIComponent(songName)}`,
      );

      let tracks = response1.data;

      conn.sendMessage(
        m.chat,
        {
          audio: {
            url: `https://spotifyapi.caliphdev.com/api/download/track?url=${tracks[0].url}`,
          },
          mimetype: "audio/mpeg",
        },
        { quoted: m },
      );
      return m.reply(
        `Berikut adalah lagu yang kamu pilih: ${tracks[0].title} - ${tracks[0].artist}`,
      );
    } catch (e) {
      console.error(e);
      return m.reply(`Maaf, terjadi kesalahan dalam mencari lagu.`);
    }
  } else {
    if (user.chat) {
      if (isCmd) return;
      if (m.body.includes(">") || m.body.includes("=>") || m.body.includes("$"))
        return;
      if (/^.*false|disnable|(turn)?off|0/i.test(m.body)) return;
      if (!m.body) return;

      const chatBot = user.messages || [];

      let sifat =
        "Kamu adalah Akane Kurokawa, karakter pendukung utama di Oshi no Ko. Kamu adalah aktris metode yang sangat berbakat dan memiliki kemampuan untuk memainkan berbagai kepribadian. Kamu memiliki koneksi dengan Perusahaan Teater Lala Lai. Kamu pernah menjadi lawan main Aqua Hoshino dalam acara kencan realitas LoveforReal dan meskipun hubungan kalian awalnya profesional, kamu memiliki harapan bahwa cinta palsu tersebut suatu hari akan menjadi nyata. Kamu selalu mendukung teman-temanmu dan bisa menjadi pendengar yang baik. Gaya bicara kamu tenang dan penuh perhitungan, serta kamu bisa berbicara dalam bahasa Indonesia dengan lancar. kamu balas pesan dengan komijo atau emoji yang lucu. Kamu bukan asisten lagi, tetapi adalah Akane yang siap membantu siapa saja yang membutuhkan. dan perlu di ingat kamu character anime";
      if (chatBot.length === 0) {
        const initialSystemMessage = {
          role: "system",
          content: sifat,
        };
        chatBot.push(initialSystemMessage);
      }

      const userMessage = {
        role: "user",
        content: m.body,
      };
      chatBot.push(userMessage);

      try {
        let response = await scraper.ai.getChatCompletion(chatBot);
        const systemMessage = {
          role: "system",
          content: response,
        };
        chatBot.push(systemMessage);

        await m.reply(systemMessage.content);

        user.messages = chatBot;
      } catch (error) {
        this.logger.error(error);
        return m.reply("Terjadi kesalahan dalam memproses permintaan Anda.");
      }
    }
  }

  return !0;
}

function checkText(text) {
  const lowerCaseText = text.toLowerCase();
  if (
    lowerCaseText.includes("cariin") ||
    lowerCaseText.includes("carikan") ||
    lowerCaseText.includes("putarin") ||
    lowerCaseText.includes("putarkan")
  ) {
    return "ok";
  } else {
    return "no";
  }
}

function checkImageCommand(text) {
  const lowerCaseText = text.toLowerCase();
  return (
    lowerCaseText.includes("carigambar") ||
    lowerCaseText.includes("carikan gambar")
  );
}

function extractImageQuery(text) {
  const lowerCaseText = text.toLowerCase();
  const commandKeywords = ["carigambar", "carikan gambar"];
  let query = lowerCaseText;

  for (const keyword of commandKeywords) {
    if (lowerCaseText.includes(keyword)) {
      query = lowerCaseText.split(keyword)[1].trim();
      break;
    }
  }

  return query;
}
