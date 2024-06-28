export default {
  command: ["delete", "d"],
  description: "delete message from group",
  name: "delete",
  tags: "group",

  group: true,

  run: async (m, { conn }) => {
    const quoted = m.isQuoted ? m.quoted : m;
    if (quoted.fromMe) {
      await conn.sendMessage(m.chat, { delete: quoted.key });
    } else {
      if (!m.isBotAdmin) return m.reply("botAdmin");
      if (!m.isAdmin) return m.reply("admin");
      await conn.sendMessage(m.chat, { delete: quoted.key });
    }
  },
};
