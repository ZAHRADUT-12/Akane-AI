export default {
  command: ["viewdatabase", "lihatdatabase", "database"],
  description: "Menampilkan statistik penggunaan perintah dalam database",
  name: "database",
  tags: "tools",
  limit: false,

  run: async (m, { conn }) => {
    let totaluser = Object.keys(db.data.users).length;
    let stats = Object.entries(db.data.stats).map(([key, val]) => {
      let name = Array.isArray(plugins[key]?.help)
        ? plugins[key]?.help?.join(" & ")
        : plugins[key]?.help || key;
      if (/exec/.test(name)) return;
      return { name, ...val };
    });
    stats = await stats.filter((e) => e).sort((a, b) => b.total - a.total);
    let cut = stats.slice(0, 3);
    let txt = `📊 *Database: ${totaluser} User*\n\n`;
    txt += `*Command Digunakan: ${stats.length}*\n\n`;
    txt += `*Paling sering digunakan:*`;
    for (let i of cut) {
      txt += `\n*[ ${i.total} hit ]*`;
      txt += `\n┗⊱ ${i.name.split("/").pop().replace(".js", "")}`;
    }
    await m.reply(txt);
  },
};
