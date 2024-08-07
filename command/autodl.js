export async function before(m) {
  let isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false;
  let budy = typeof m.text == "string" ? m.text : "";
  let extract = budy ? generateLink(budy) : null;
  if (extract && !isCommand && m.isGroup) {
    if (db.data.chats[m.chat].autodl && !m.isBaileys) {
      let regexTik =
        /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/;
      let regexIg =
        /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/;
      let regexYt =
        /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;

      let instagramDL = extract.filter((v) => igFix(v).match(regexIg));
      let tiktokDL = extract.filter((v) => ttFix(v).match(regexTik));
      let youtubeDL = extract.filter((v) => v.match(regexYt));

      if (tiktokDL != 0) {
        await m.reply("[!] Link TikTok Detect...");
        tiktokDL.map(async (url) => {
          const response = await func.fetchJson(
            `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
          );
          const caption = `</> TikTok Download </>\n\n• ID : ${response.id}\n•Title : ${response.title}\n\nCopyright © AkaneBot 2024`;
          await m.reply(response.video?.noWatermark);
        });
      }
    }
  }
}

function generateLink(text) {
  let regex =
    /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  return text.match(regex);
}

function ttFix(url) {
  if (!url.match(/(tiktok.com\/t\/)/g)) return url;
  let id = url.split("/t/")[1];
  return "https://vm.tiktok.com/" + id;
}

function igFix(url) {
  let count = url.split("/");
  if (count.length == 7) {
    let username = count[3];
    let destruct = this.removeItem(count, username);
    return destruct.map((v) => v).join("/");
  } else return url;
}
