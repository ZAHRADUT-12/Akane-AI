export default {
  command: ["welcome"],
  description: "on/off Welcome group",
  name: "welcome",
  tags: "group",

  group: true,
  admin: true,

  run: async (m, { conn }) => {
    let db = global.db.data.chats[m.chat];
    if (db.welcome) {
      db.welcome = false;
      m.reply("Succes Deactive Welcome on This Group");
    } else if (!db.welcome) {
      db.welcome = true;
      m.reply("Succes Activated Welcome on This Group");
    }
  },
};
