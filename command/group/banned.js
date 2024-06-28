export default {
  command: ["banchat", "bnc", "unbanchat", "ubc"],
  description: "Banned/unban chat group",
  name: ["banchat", "unbanchat"],
  tags: "group",

  group: true,
  admin: true,

  run: async (m) => {
    try {
      let chat = db.data.chats[m.chat];
      if (m.command.toLowerCase() === "banchat") {
        chat.banned = true;
        m.reply(`The bot will not respond to the group.`);
      } else {
        chat.banned = false;
        m.reply(`Bot Response in this chat.`);
      }
    } catch (error) {
      console.error(error);
      m.reply("An error occurred while trying to ban the chat.");
    }
  },
};
