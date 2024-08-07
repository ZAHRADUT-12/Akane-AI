import similarity from "similarity";

export async function before(m) {
  conn.game = conn.game ? conn.game : {};
  const family100_id = "family100_game-" + m.chat; // ID unik untuk instance game

  if (m.isGroup && conn.game && family100_id in conn.game) {
    if (!m.body) return;
    if (/[$>|=>]/i.test(m.body)) return;

    const threshold = 0.72;

    let user = global.db.data.users[m.sender]; // Mengambil data pengguna dari database
    let room = conn.game[family100_id]; // Mendapatkan data permainan
    let text = m.body.toLowerCase().replace(/[^\w\s\-]+/, ""); // Memproses input
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.body); // Cek apakah pengguna menyerah

    if (!isSurrender) {
      // Cek kecocokan jawaban
      let index = room.jawaban.indexOf(text);
      if (index < 0) {
        if (
          Math.max(
            ...room.jawaban
              .filter((_, index) => !room.terjawab[index])
              .map((jawaban) => similarity(jawaban, text)), // Menggunakan fungsi similarity untuk memeriksa kecocokan
          ) >= threshold
        ) {
          await m.reply("🔍 Dikit lagi! Coba tebak lagi.");
        }
        return;
      }

      if (room.terjawab[index]) return;
      room.terjawab[index] = m.sender;
      user.balance += room.winScore; // Tambahkan balance jika jawaban benar
    }

    // Cek apakah semua jawaban sudah terjawab
    let isWin = room.terjawab.length === room.terjawab.filter((v) => v).length;
    let caption = `
*Soal:* ${room.soal}
Terdapat *${room.jawaban.length}* jawaban${
      room.jawaban.find((v) => v.includes(" "))
        ? `\n(beberapa jawaban terdapat spasi)`
        : ""
    }
${isWin ? `🏆 *SEMUA JAWABAN TERJAWAB!*` : isSurrender ? "✋ *MENYERAH!*" : ""}
${Array.from(room.jawaban, (jawaban, index) => {
  return isSurrender || room.terjawab[index]
    ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? "@" + room.terjawab[index].split("@")[0] : ""}`.trim()
    : false;
})
  .filter((v) => v)
  .join("\n")}
${isSurrender ? "" : `+${room.winScore} Balance tiap jawaban benar`}
        `.trim();

    const msg = await m.reply(
      caption +
        `\n\n${isWin || isSurrender ? "" : "Ketik *nyerah* untuk menyerah"}`,
      { mentions: conn.parseMention(caption) }, // Menyertakan mention jika diperlukan
    );
    room.msg = msg;

    if (isWin || isSurrender) {
      delete conn.game[family100_id]; // Hapus game jika selesai
    }
  }
}
