export default {
  command: ["demote"],
  description: "demote admin to member",
  name: "demote",
  tags: "group",

  group: true,
  admin: true,
  botAdmin: true,

  run: async (m, { conn }) => {
    let who = m.quoted ? m.quoted.sender : m.mentions ? m.mentions[0] : "";
    if (!who) throw `*quote / @tag* salah satu !`;
    await conn.groupParticipantsUpdate(m.chat, [who], "demote");
    await m.reply(`_*Succes demote admin*_ *@${who.split("@")[0]}*`, {
      mentions: [who],
    });
  },
};
