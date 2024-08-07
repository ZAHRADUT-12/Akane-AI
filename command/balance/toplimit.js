export default {
  command: ["toplimit", "leaderboardlimit"],
  description: "Menampilkan top 15 pengguna dengan limit terbanyak",
  name: "toplimit",
  tags: "limit",

  run: async (m, { conn }) => {
    let limits = Object.values(global.db.data.users)
      .filter((user) => user.limit !== undefined)
      .sort((a, b) => b.limit - a.limit);
    let top = "*── 「 TOP LIMIT 」 ──*\n\n";
    var arrTop = [];
    var total = 15;
    if (limits.length < 15) total = limits.length;
    for (let i = 0; i < total; i++) {
      let userId = Object.keys(global.db.data.users)[
        Object.values(global.db.data.users).indexOf(limits[i])
      ];
      let names = await conn.getName(userId);
      let userIdWithoutSuffix = userId.replace("@s.whatsapp.net", ""); // Menghilangkan @s.whatsapp.net
      top += `${i + 1}. ${names} - wa.me/${userIdWithoutSuffix}\n=> limit: ${limits[i].limit}\n\n`;
      arrTop.push(userIdWithoutSuffix);
    }
    m.reply(top, { mentions: arrTop });
  },
};
