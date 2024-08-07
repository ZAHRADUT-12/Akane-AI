export default {
  command: ["profile", "me"],
  name: ["profile", "me"],
  tags: "main",

  run: async (m) => {
    const user = global.db.data.users[m.sender];

    const txt = `
*👤 Nama:* ${user.name || m.pushName}
*📊 Level:* ${user.level}
*🏅 Peringkat:* ${user.grade}
*🌟 Status:* ${user.premium ? "Premium" : "Gratisan"}
*💰 Balance:* ${func.toDollar(user.balance)}
*🔋 Limit:* ${user.limit}
*📈 Exp:* ${user.exp}
*⚠️ Peringatan:* ${user.warn}
*🕒 Terakhir Aktif:* ${new Date(user.lastChat).toLocaleString()}
*🏆 Hit:* ${user.hit}

*👫 Pasangan:* ${user.life.waifu || "Belum ada"}
*💌 Tentang:* ${user.life.about || "Tidak ada informasi"}

*📅 Bergabung pada:* ${user.regTime !== -1 ? new Date(user.regTime).toLocaleDateString() : "Tanggal tidak tersedia"}
*🎁 Hadiah terakhir:* ${user.lastClaim ? new Date(user.lastClaim).toLocaleDateString() : "Tidak ada hadiah terbaru"}
*🔄 Jumlah Klaim:* ${user.claimCount}
*🔢 Batas Harian:* ${user.dailyLimit}
`.trim();
    await m.reply(txt);
  },
};
