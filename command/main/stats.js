import bytes from "bytes";
import v8 from "v8";

const readMore = String.fromCharCode(8206).repeat(4001);
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const formatBytes = (n) => bytes(+n, { unitSeparator: " " });
const toUpper = (str) => str.replace(/^\w/, (c) => c.toUpperCase());
const formatHeap = (x) =>
  x
    .split("_")
    .map((i) => toUpper(i))
    .join(" ");

export default {
  command: ["stats"],
  name: "stats",
  tags: "main",

  run: async (m, { conn }) => {
    const objChats = conn.chats.dict;
    const personalChats = Object.values(objChats).filter(
      (chat) => !chat.id.includes("@g.us"),
    );
    const groupChats = Object.values(objChats).filter((chat) =>
      chat.id.includes("@g.us"),
    );
    const communityChats = Object.values(objChats).filter(
      (chat) => chat.isCommunity && chat.isCommunityAnnounce,
    );

    let runtime = new Date(process.uptime() * 1000).toUTCString().split(" ")[4];
    let ping = Date.now() - m.timestamp * 1000;

    let str =
      `*BOT:*\n` +
      `- Personal Chats: ${personalChats.length}\n` +
      `- Group Chats: ${groupChats.length}\n` +
      `- Community: ${communityChats.length}\n` +
      `- Uptime: ${runtime}\n` +
      `- Response: ${rtf.format(ping / 1000, "second").split("in ")[1]}\n${readMore}\n`;

    str += `*NodeJS Memory Usage:*\n`;
    let used = process.memoryUsage();
    for (let [key, val] of Object.entries(used)) {
      str += `- ${toUpper(key)}: ${formatBytes(val)}\n`;
    }

    str += `\n*V8 Heap Stats:*\n`;
    let heap = v8.getHeapStatistics();
    for (let [key, val] of Object.entries(heap)) {
      str += `- ${formatHeap(key)}: ${formatBytes(val)}\n`;
    }

    await m.reply(str.trim());
  },
};
