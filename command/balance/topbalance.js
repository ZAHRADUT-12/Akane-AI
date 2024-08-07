export default {
  command: ["topbalance", "topglobal"],
  description: "Menampilkan top 15 pengguna dengan balance tertinggi",
  name: "topbalance",
  tags: "balance",

  run: async (m, { conn }) => {
    let uang = Object.values(global.db.data.users)
      .filter((user) => user.balance !== undefined)
      .sort((a, b) => b.balance - a.balance);
    let top = "*── 「 TOP BALANCE 」 ──*\n\n";
    var arrTop = [];
    var total = 15;
    if (uang.length < 15) total = uang.length;
    for (let i = 0; i < total; i++) {
      let userId = Object.keys(global.db.data.users)[
        Object.values(global.db.data.users).indexOf(uang[i])
      ];
      let names = await conn.getName(userId);
      let userIdWithoutSuffix = userId.replace("@s.whatsapp.net", ""); // Menghilangkan @s.whatsapp.net
      top += `${i + 1}. ${names} - wa.me/${userIdWithoutSuffix}\n=> balance : ${func.toDollar(uang[i].balance)}\n\n`;
      arrTop.push(userIdWithoutSuffix);
    }
    m.reply(top, { mentions: arrTop });
  },
};
