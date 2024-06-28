export default {
  command: ["promote"],
  description: "elevate members to admins",
  name: "promote",
  tags: "group",

  group: true,
  admin: true,
  botAdmin: true,

  run: async (m, { conn }) => {
    let who = m.quoted ? m.quoted.sender : m.mentions ? m.mentions[0] : "";
    if (!who) throw `*quote / @tag* salah satu !`;
    await conn.groupParticipantsUpdate(m.chat, [who], "promote");
    await m.reply(`_*Succes promote member*_ *@${who.split("@")[0]}*`, {
      mentions: [who],
    });
  },
};
