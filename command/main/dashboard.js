import moment from "moment-timezone";

export default {
  command: ["dashboard"],
  description: "dashboard stats bot",
  name: "dashboard",
  tags: "main",

  run: async (m, { conn }) => {
    const stats = global.db.data.stats;

    let totalUsage = 0;
    const commandUsage = [];
    const now = Date.now();

    for (const [command, data] of Object.entries(stats)) {
      totalUsage += data.total;
      commandUsage.push({
        name: command.split("/").pop().replace(".js", ""),
        total: data.total,
        last: data.last,
      });
    }

    commandUsage.sort((a, b) => b.total - a.total);

    const totalText = `*Total Seluruh Penggunaan :* ${totalUsage} kali.\n\n`;
    let commandText = "";
    commandUsage.forEach((cmd, index) => {
      const lastDate = moment(cmd.last)
        .tz("Asia/Jakarta")
        .format("dddd, DD MMMM YYYY [pukul] HH.mm [WIB]");
      commandText += `*${index + 1}.* ${cmd.name} : ${cmd.total} kali.\n- ${lastDate}\n`;
    });

    const recentStats = {
      sixHours: commandUsage
        .filter((cmd) => now - cmd.last <= 6 * 3600 * 1000)
        .reduce((acc, cmd) => acc + cmd.total, 0),
      twelveHours: commandUsage
        .filter((cmd) => now - cmd.last <= 12 * 3600 * 1000)
        .reduce((acc, cmd) => acc + cmd.total, 0),
      twentyFourHours: commandUsage
        .filter((cmd) => now - cmd.last <= 24 * 3600 * 1000)
        .reduce((acc, cmd) => acc + cmd.total, 0),
      oneWeek: commandUsage
        .filter((cmd) => now - cmd.last <= 7 * 24 * 3600 * 1000)
        .reduce((acc, cmd) => acc + cmd.total, 0),
    };

    const recentText =
      `\n*6 Jam Terakhir :* Digunakan ${recentStats.sixHours} kali.\n` +
      `*12 Jam Terakhir :* Digunakan ${recentStats.twelveHours} kali.\n` +
      `*24 Jam Terakhir :* Digunakan ${recentStats.twentyFourHours} kali.\n` +
      `*1 Minggu Terakhir :* Digunakan ${recentStats.oneWeek} kali.\n`;

    const result = totalText + commandText + recentText;

    try {
      await conn.sendMessage(m.chat, { text: result }, { quoted: m });
    } catch (error) {
      console.error(error);
    }
  },
};
