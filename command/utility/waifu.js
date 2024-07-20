import jikanjs from "@mateoaranda/jikanjs";

export default {
  command: ["waifu"],
  description: "Choose a waifu",
  name: "waifu",
  tags: "utility",

  run: async (m, { conn, text, args, isPrems, command }) => {
    const user = global.db.data.users[m.sender].life;

    if (!m.text) {
      m.reply(".waifu [set] [id]");
      return;
    }
    if (!user.name || !user.gender || !user.age) {
      m.reply(
        `⚠️ Untuk menggunakan fitur ini, kamu harus teregistrasi terlebih dahulu dengan cara:\n\nKetik *${m.prefix}setlife* dan ikuti contoh`,
      );
      return;
    }

    const age = parseInt(user.age, 10);
    if (age >= 6 && age <= 16) {
      m.reply(
        `⚠️ Kamu tidak bisa memilih waifu karena umurmu masih 16 tahun kebawah. Minimal 17 tahun agar bisa memilih waifu.`,
      );
      return;
    }

    if (user.gender === "female") {
      m.reply(
        `⚠️ Tidak bisa memilih waifu karena kamu berjenis kelamin perempuan!`,
      );
      return;
    }

    if (user.waifu && !isPrems && user.gamepass < 1) {
      m.reply(
        "❗ Waifu pengguna hanya bisa diatur satu kali saja.\n💳 atau gunakan gamepass",
      );
      return;
    }

    if (args[0] === "set" && !isNaN(args[1])) {
      try {
        const { data } = await jikanjs.loadCharacter(args[1], "full");
        const image = await scraper.search.pinterest(
          `${data.name} anime icons`,
        );

        user.waifu = data.name;
        user.id = data.mal_id;
        user.about = data.about;

        let wdone =
          `✅ Kamu telah memilih *${data.name}* sebagai waifumu\n\nKetik *${m.prefix} waifume* untuk melihat detail waifu.`.trim();
        m.reply(wdone, {
          contextInfo: {
            externalAdReply: {
              showAdAttribution: true,
              title: `Kenapa milih ${data.name}?`,
              body: "Gambar terkadang tidak muncul",
              thumbnailUrl: func.pickRandom(image),
              sourceUrl: "https://akanebot.xyz",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        });

        if (user.gamepass >= 1 && !isPrems && user.waifu) {
          user.gamepass -= 1;
          m.reply("-1 💳 gamepass");
        }
      } catch (error) {
        console.error(error);
        m.reply("Terjadi kesalahan saat memproses waifu.");
      }
    } else if (text.length > 1) {
      try {
        const { data } = await jikanjs.raw(["characters"], {
          page: 1,
          q: text,
        });

        if (!data.length) {
          m.reply("Tidak ditemukan.");
          return;
        }

        const arr = data.map((x, i) => ({
          title: `${i + 1}. ${x.name} (${x.name_kanji})`,
          description: `ID: ${x.mal_id} | Favorite: ${x.favorites}`,
          id: `${m.prefix + m.command} set ${x.mal_id}`,
        }));

        const sections = [
          {
            title: "Waifu Life",
            rows: arr,
          },
        ];

        await conn.sendListM(
          m.chat,
          "Berikut yang anda cari",
          wm,
          "",
          sections,
          m,
        );
      } catch (error) {
        console.error(error);
        m.reply("Terjadi kesalahan saat mencari waifu.");
      }
    } else {
      m.reply(
        `Masukan nama\n\n*Example:* ${m.prefix + m.command} shina mahiru`,
      );
    }
  },
};
