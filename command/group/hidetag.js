export default {
  command: ["hidetag", "ht"],
  description: "Tag all member mentions",
  name: "hidetag",
  tags: "group",

  group: true,
  admin: true,

  run: async (m, { conn }) => {
    const quoted = m.isQuoted ? m.quoted : m;
    let mentions = m.metadata.participants.map((a) => a.id);
    let mod = await conn.cMod(
      m.chat,
      quoted,
      /hidetag|tag|ht|h|totag/i.test(quoted.body.toLowerCase())
        ? quoted.body.toLowerCase().replace(m.prefix + m.command, "")
        : quoted.body,
    );
    conn.sendMessage(m.chat, { forward: mod, mentions });
  },
};
