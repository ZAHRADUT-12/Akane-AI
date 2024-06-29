import { translate } from "@vitalets/google-translate-api";

let handler = async (m, { args }) => {
  let lang, text;
  if (args.length >= 2) {
    lang = args[0];
    text = args.slice(1).join(" ");
  } else if (m.quoted && m.quoted.text) {
    lang = args[0];
    text = m.quoted.text;
  } else {
    throw `Contoh penggunaan: ${m.prefix + m.command} id Apa kabar?`;
  }

  // Panggil fungsi translate dengan teks dan bahasa tujuan
  let res = await translate(text, { to: lang, autoCorrect: true }).catch((err) => {
    console.error("Terjadi kesalahan dalam terjemahan:", err);
    return null;
  });

  // Pastikan respons berhasil dan memiliki hasil terjemahan
  if (!res || !res.text) {
    throw `Error: Terjemahan gagal untuk "${text}" ke "${lang}"`;
  }

  // Dapatkan informasi bahasa sumber dari respons yang diberikan
  let fromLanguage = res.raw ? res.raw.src : "unknown";

  // Format balasan sesuai dengan hasil terjemahan
  m.reply(`*Dari:* ${fromLanguage}\n*Ke:* ${lang}\n\n${res.text.trim()}`);
};

export default {
  command: ['translate', 'tr'],
  description: 'Menerjemahkan teks.',
  name: 'translate',
  tags: 'tools',
  limit: 1,
  run: handler,
};