export default {
  command: ["waifume"],
  description: "Show your waifu information",
  name: "waifume",
  tags: "utility",

  run: async (m, { conn, text, args, command }) => {
    let who =
      m.mentions && m.mentions[0]
        ? m.mentions[0]
        : args[0]
          ? args
              .join("")
              .replace(/[@ .+-]/g, "")
              .replace(/^\+/, "")
              .replace(/-/g, "") + "@s.whatsapp.net"
          : "";
    if (!who) {
      who = m.sender;
    }

    const user = global.db.data.users[who].life;

    if (!user.name || !user.gender || !user.age) {
      m.reply(
        `⚠️ Untuk menggunakan fitur ini, kamu harus teregistrasi terlebih dahulu dengan cara:\n\nKetik *${m.prefix}setlife* dan ikuti tutorialnya`,
      );
      return;
    }
    if (!user.waifu) {
      m.reply(
        `⚠️ Kamu belum punya waifu! Ketik *${m.prefix}waifu* dan cari waifumu.`,
      );
      return;
    }

    let images = await scraper.search.pinterest(`${user.waifu} anime icons`);

    let caption = `*WAIFU INFO*
💃🏻 Nama Waifu: ${user.waifu}
💘 Level Waifu: ${user.exp} 

${user.name} dan ${user.waifu} adalah sepasang kekasih dengan kehidupan yang sangat bahagia. ${user.name} beruntung sekali karena memilih waifu seperti ${user.waifu}. Semoga mereka selalu hidup bahagia

Tingkatkan level waifumu dengan melakukan kencan *${m.prefix}kencan*

Fact: _level waifumu tidak akan tereset walaupun sudah mengganti waifu._
`.trim();

    conn.reply(m.chat, caption, m, {
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: `Hi, I'm ${user.waifu}`,
          body: "Gambar terkadang tidak muncul",
          thumbnailUrl: func.pickRandom(images),
          sourceUrl: global.link,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    });
  },
};
