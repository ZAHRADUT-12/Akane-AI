export default {
  command: ["csn", "casino"],
  description: "Casino game: Bet your balance and test your luck!",
  name: "casino",
  tags: "games",
  group: true,

  run: async function (m, { conn, text }) {
    const nomorbot = func.baileys.jidNormalizedUser(conn.user.id);
    conn.casino = conn.casino ? conn.casino : {};

    if (m.sender in conn.casino) {
      return m.reply(
        "Masih ada yang melakukan casino di sini, tunggu sampai selesai!!",
      );
    } else {
      conn.casino[m.sender] = true;
    }

    try {
      let randomAku = Math.floor(Math.random() * 7);
      let randomKamu = Math.floor(Math.random() * 15);

      let Aku = randomAku;
      let Kamu = randomKamu;
      let count = text.trim().split(" ")[0];
      count = count
        ? /all/i.test(count)
          ? Math.floor(global.db.data.users[m.sender].balance / 1)
          : parseInt(count)
        : 1;
      count = Math.max(1, count);

      if (isNaN(count)) {
        return conn.reply(
          m.chat,
          `Format salah. Gunakan: ${m.prefix + m.command} <jumlah>\nContoh: ${m.prefix + m.command} 1000`,
          m,
        );
      }

      if (global.db.data.users[m.sender].balance < count) {
        return conn.reply(
          m.chat,
          "Saldo kamu tidak mencukupi untuk Casino. Silahkan gunakan *.claim* terlebih dahulu!",
          m,
        );
      }

      global.db.data.users[m.sender].balance -= count;

      let result;
      if (Aku > Kamu) {
        result = `❌ *LOSE* ❌\nKamu kehilangan ${func.toDollar(count * 1)} Balance.`;
      } else if (Aku < Kamu) {
        result = `🎉 *WIN* 🎉\nKamu menang ${func.toDollar(count * 2)} Balance.`;
        global.db.data.users[m.sender].balance += count * 2;
      } else {
        result = `🔖 *DRAW* 🔖\nKamu mendapatkan kembali ${func.toDollar(count * 1)} Balance.`;
        global.db.data.users[m.sender].balance += count;
      }

      const caption = `
💰 *C A S I N O* 💰
===================
> *@${m.sender.split("@")[0]}* - [USER]
┗┅⭑ ${Kamu} Point
> *@${nomorbot.split("@")[0]}* - [BOT]
┗┅⭑ ${Aku} Point
===================
${result}
`.trim();

      await m.reply(caption, {
        mentions: [m.sender, nomorbot],
      });
    } catch (e) {
      console.log(e);
      m.reply("Error!!");
    } finally {
      delete conn.casino[m.sender];
    }
  },

  failed: "Gagal menjalankan perintah %cmd\n\n%error",
  wait: null,
  done: null,
};
