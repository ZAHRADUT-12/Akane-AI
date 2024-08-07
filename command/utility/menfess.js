const bahasa = ["menfes", "menfess", "confes", "confess"];

export default {
  command: ["menfess", "menfesschat", "menfessstop", "menfesssettimer"],
  description: "Menfess chat system for anonymous messaging",
  // example: "%pmenfess <nomor|pesan> | %pmenfesschat | %pmenfessstop | %pmenfesssettimer",
  name: "menfess",
  tags: "utility",
  private: true,

  run: async (m, { conn, text, args, command }) => {
    let datas = db.data.datas;
    let menfesschat = datas.menfesschat;
    let object = Object.keys(menfesschat);

    if (command.includes("chat")) {
      if (!text)
        return m.reply(
          `*Format :*\n${m.prefix + command} nomor_tujuan\n\n*Contoh Penggunaan :*\n${m.prefix + command} 6282121332749`,
        );

      let who = text
        ? text.replace(/\D/g, "") + "@s.whatsapp.net"
        : m.mentionedJid?.mentionedJid[0]
          ? m.mentionedJid[0]
          : "";
      if (!who) return m.reply(`tag atau ketik nomornya!`);

      let meh = await conn.onWhatsApp(who);
      if (meh.length < 1)
        return m.reply(
          `[!] Failed, @${who.split("@")[0]} bukan pengguna WhatsApp.`,
          null,
          { mentions: [who] },
        );

      who = meh[0].jid;
      if (somematch([conn.user.jid, m.sender], who))
        throw `[!] Cari nomor yang lain.`;

      if (object.length > 0) {
        let sesisender = false,
          sesitarget = false;
        for (let x of object) {
          let p = menfesschat[x];
          if (somematch([m.sender, who], p.a)) sesisender = true;
          if (somematch([m.sender, who], p.b)) sesitarget = true;
        }
        if (sesisender || sesitarget)
          return m.reply(
            `Anda masih berada dalam sesi *menfesschat*\n\nkeluar dari sesi dengan perintah :\n*${m.prefix}menfessstop*`,
          );
      }

      let id = +new Date();
      menfesschat[m.id] = {
        a: m.sender,
        b: who,
        check: function (who = who) {
          return [conn.a, conn.b].includes(who);
        },
        other: function (who = who) {
          return who === conn.a ? conn.b : who === conn.b ? conn.a : "";
        },
      };

      await conn.reply(
        m.sender,
        `Anda berhasil terhubung dengan @${who.split("@")[0]}, percakapan selanjutnya akan diteruskan ke target.\n*Note :* Hanya dapat digunakan dalam private chat.\n\nGunakan perintah *${m.prefix}menfessstop* untuk keluar dari sesi.`,
        m,
        { mentions: [who] },
      );
      await conn.reply(
        who,
        `Hi, saya Bot Menfess, Ada pengirim rahasia yang sedang terhubung denganmu, chat *_forwarded_* menandakan pesan tersebut berasal dari pengirim.\n\nKetik *.menfessstop* untuk keluar dari sesi percakapan.`,
      );
    } else if (command.includes("stop")) {
      if (object.length == 0) throw "Belum ada sesi *menfesschat* di Bot ini.";

      let dataku,
        target,
        a = false;
      for (let x of object) {
        let p = menfesschat[x];
        if (p.a.includes(m.sender)) {
          a = true;
          dataku = x;
          target = p.b;
        }
        if (p.b.includes(m.sender)) {
          dataku = x;
          target = p.a;
        }
      }

      if (!dataku) throw "Kamu tidak berada dalam sesi *menfesschat*";
      await m.reply(
        `Berhasil keluar dari sesi *menfesschat*.${a ? "" : `\n\nTertarik mencoba ? Ketik .menfess`}`,
      );
      await conn.reply(
        target,
        `${a ? "Pengirim" : "Target"} telah menghentikan sesi percakapan dengan anda, terima kasih telah menggunakan layanan.${a ? `\n\nTertarik mencoba ? Ketik .menfesschat` : ""}`,
      );
      delete menfesschat[dataku];
    } else if (
      somematch(
        bahasa.map((v) => v + "settimer"),
        command,
      )
    ) {
      if (!isOwner) return m.reply("*「OWNER BOT ONLY」*");

      datas.menfesschatcd = +new Date();
      let date = new Date(datas.menfesschatcd);
      m.reply(
        `MenfessChat reset setiap pukul ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      );
    } else {
      if (!text)
        throw `Ungkapkan perasaanmu secara anonim. Anda juga dapat mengirim media seperti audio, video, gambar, dan stiker.\n\n*Contoh Penggunaan :*\n${m.prefix + command} 6282121332749 | hai kamu\n\n*${m.prefix}menfesschat* untuk chatting dengan orang lain secara anonim\n*${m.prefix}menfessstop* untuk keluar dari sesi chatting`;

      if (text.includes("|")) {
        args[0] = text.split(`|`)[0].replaceAll(" ", "");
        args[1] = text.split(`|`)[1];
      } else args[1] = args.slice(1).join(" ");

      let who = args[0]
        ? args[0].replace(/\D/g, "") + "@s.whatsapp.net"
        : m.mentionedJid?.mentionedJid[0]
          ? m.mentionedJid[0]
          : "";
      if (!who) throw `tag atau ketik nomornya!`;

      let meh = await conn.onWhatsApp(who);
      if (meh.length == 0)
        return m.reply(
          `[!] Failed, @${args[0] || ""} bukan pengguna WhatsApp.`,
          null,
          { mentions: [args[0]] },
        );

      who = meh[0].jid;
      if (who.includes(conn.user.jid))
        throw `[!] Tidak bisa mengirim *menfess* ke Bot`;
      if (!args[1]) throw `[!] Masukkan isi pesan`;
      if (args[1].length > 3000) throw `[!] Teks Kepanjangan`;

      let buffer,
        q = m.quoted ? m.quoted : m,
        mime = (q.msg || q).mimetype || q.mediaType || "";
      let mpro,
        menfess = datas.menfess;
      if (/image|video|sticker|webp|audio/g.test(mime))
        buffer = await q.download?.();
      let target = `Hi Saya Bot, Ada Yang Kirim Pesan Ke Kamu\n\n( Dari : *Pengirim Rahasia* )\n${mime ? `*🎴 Type : ${mime.replace("webp", "sticker")}*\n\n` : ""}💌 *Isi Pesan :*\n${args[1]}\n\n_gesek pesan ke kanan untuk membalas >>>_`;
      let senderr = `Mengirim Pesan ${mime ? `*${mime}*` : ""} ke @${who.split("@")[0]}\n\n*Isi Pesan :*\n${args[1]}`;

      if (m.isGroup)
        await m.reply(
          `_>> proses mengirim pesan *${mime ? mime : "teks"}* . . ._`,
        );

      if (mime.includes("audio"))
        await conn.sendMsg(who, {
          audio: buffer,
          mimetype: "audio/mpeg",
          ptt: true,
        });
      if (mime && !mime.includes("audio")) {
        if (!mime.includes("webp"))
          await conn.sendFile(m.sender, buffer, "", senderr, null, false, {
            mentions: [who],
          });
        mpro = await conn.sendFile(who, buffer, "", target, null);
        if (mime.includes("webp")) {
          await conn.reply(m.sender, senderr, null, { mentions: [who] });
          await conn.reply(who, target);
        }
      } else {
        await conn.reply(m.sender, senderr, null, { mentions: [who] });
        mpro = await conn.reply(who, target, null);
      }

      menfess[mpro.key.id] = { sender: m.sender, target: who, text: args[1] };
    }
  },
};

const somematch = (data, id) => {
  let res = data.find((el) => el === id);
  return res ? true : false;
};
