export default {
  command: ["kick"], // Command aliases
  description: "Kick a member from the group.", // Provide a meaningful description
  help: ["kick"], // Help command trigger
  tag: "group", // Command category or tag

  group: true,
  admin: true,
  botAdmin: true,

  run: async (m, { conn }) => {
    try {
      let who = m.quoted
        ? m.quoted.sender
        : m.mentions?.[0]
          ? m.mentions[0]
          : m.text
            ? m.text.replace(/\D/g, "") + "@s.whatsapp.net"
            : "";
      if (!who || who == m.sender)
        return m.reply("*Quote / tag* target yang ingin di kick!!");
      if (m.metadata.participants.filter((v) => v.id == who).length == 0)
        return m.reply(`Target tidak berada dalam Grup !`);
      if (
        somematch(
          [conn.user.jid, ...global.owner.map((v) => v + "@s.whatsapp.net")],
          who,
        )
      )
        return m.reply("Jangan gitu ama Owner");
      await conn.groupParticipantsUpdate(m.chat, [who], "remove");
    } catch (error) {
      console.error(error);
      await conn.sendMessage(m.chat, error.toString(), { quoted: m });
    }
  },
};

const somematch = (data, id) => {
  let res = data.find((el) => el === id);
  return res ? true : false;
};
