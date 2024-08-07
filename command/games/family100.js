export default {
  command: ["family100"],
  description: "Mulai game Family 100",
  name: "family100",
  tags: "games",
  run: async (m, { conn }) => {
    conn.game = conn.game ? conn.game : {};
    const family100_id = "family100_game-" + m.chat; // ID unik untuk instance game
    const winScore = 1499;

    if (family100_id in conn.game) {
      await m.reply(
        "Masih ada kuis yang belum terjawab di chat ini",
        conn.game[family100_id].msg,
      );
      return false;
    }

    let json = await func.fetchJson(
      "https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json",
    );
    json = json[Math.floor(Math.random() * json.length)];

    let caption = `
*Soal:* ${json.soal}
Terdapat *${json.jawaban.length}* jawaban${
      json.jawaban.find((v) => v.includes(" "))
        ? `\n(beberapa jawaban terdapat spasi)`
        : ""
    }
+${winScore} Balance tiap jawaban benar
        `.trim();

    conn.game[family100_id] = {
      family100_id,
      msg: await m.reply(caption),
      ...json,
      terjawab: Array.from(json.jawaban, () => false),
      winScore,
    };
  },
};
