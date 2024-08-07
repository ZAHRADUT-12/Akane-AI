export default {
  command: ["group"],
  name: "group",
  tags: "group",

  group: true,

  run: async (m, { conn }) => {
    let isClose = {
      // Switch Case Like :v
      open: "not_announcement",
      close: "announcement",
    }[m.args[0] || ""];
    if (isClose === undefined)
      throw `
*Format salah! Contoh :*
  *○ ${m.prefix + m.command} close*
  *○ ${m.prefix + m.command} open*
`.trim();
    await conn.groupSettingUpdate(m.chat, isClose);
  },
};
