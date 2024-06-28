import { getBinaryNodeChildren } from "@whiskeysockets/baileys";

export default {
  command: ["add", "+"],
  description: "add user to group",
  name: "add",
  tags: "group",

  group: true,
  admin: true,
  botAdmin: true,

  run: async (m, { conn }) => {
    let users =
      m.mentions.length !== 0
        ? m.mentions.slice(0, 2)
        : m.isQuoted
          ? [m.quoted.sender]
          : m.text
              .split(",")
              .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
              .slice(0, 2);
    if (users.length == 0) return m.reply("Fuck You 🖕");
    const res = await conn.groupParticipantsUpdate(m.chat, users, "add");
    for (let i of res) {
      if (i.status == 403) {
        let node = getBinaryNodeChildren(i.content, "add_request");
        await m.reply(`Can't add @${i.jid.split("@")[0]}, send invitation...`);
        let url = await conn
          .profilePictureUrl(m.chat, "image")
          .catch(
            (_) =>
              "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu",
          );
        await conn.sendGroupV4Invite(
          i.jid,
          m.chat,
          node[0]?.attrs?.code || node.attrs.code,
          node[0]?.attrs?.expiration || node.attrs.expiration,
          m.metadata.subject,
          url,
          "Invitation to join my WhatsApp Group",
        );
      } else if (i.status == 409)
        return m.reply(`@${i.jid?.split("@")[0]} already in this group`);
      else m.reply(func.format(i));
    }
  },
};
