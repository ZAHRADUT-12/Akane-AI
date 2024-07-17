export default {
  command: ["chatbot"],
  description: "Automatic Chat bot AI",
  name: "chatbot",
  tags: "main",

  run: async (m) => {
    const action = m.args[0] ? m.args[0].toLowerCase() : null;

    let user = global.db.data.users[m.sender]?.openai;

    if (action === "on") {
      user.chat = true;
      return m.reply(
        "Memulai sesi chat bersama bot, balas pesan dari bot untuk melanjutkan obrolan",
      );
    } else if (action === "off") {
      user.chat = false;
      return m.reply("Mengakhiri sesi chat bersama bot");
    } else if (action === "reset") {
      if (!user.messages.length > 0)
        return m.reply("Tidak ada history chat bot");
      user.messages = [];
      return m.reply("Succes reset chat bot.");
    } else {
      return m.reply(`Penggunaan perintah: chatbot on/off`);
    }
  },
};
