export default {
  command: ["facebook", "fb"],
  description: "Download Instagram reel/video/image",
  example: "Contoh: %p%cmd <Facebook URL>", // %p = prefix, %cmd = command, %text = teks
  name: "facebook",
  tags: "download",

  run: async (m, { conn }) => {
    const url = m.text;

    if (!func.isUrl(url))
      return m.reply(
        `Invalid URL\n\nContoh: ${m.prefix + m.command} https://www.facebook.com/InfoDonk/videos/363595620105316/?mibextid=rS40aB7S9Ucbxw6v`,
      );

    await m.reply("wait");
    
    try {
      let response = await func.fetchJson(
        API("arifzyn", "/download/facebook", { url: func.isUrl(url)[0] }, "apikey"),
      );
      
      if (response.status !== 200) {
        m.reply(func.format(response))	
      } 
      
      await conn.sendMedia(m.chat, response?.result?.sd?.link, m)
    } catch (err) {
      conn.logger.error(`Error fetching Instagram reel:`, err);
      return m.reply("An error occurred while fetching the Instagram reel.");
    }
  },
};
