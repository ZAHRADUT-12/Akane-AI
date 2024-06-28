export default {
  command: ["linkgroup", "linkgrup", "linkgc"],
  description: "get link group invite",
  name: "linkgroup",
  tags: "group",

  group: true,
  admin: true,
  botAdmin: true,

  run: async (m, { conn }) => {
    await m.reply(
      "https://chat.whatsapp.com/" + (await conn.groupInviteCode(m.chat)),
    );
  },
};
