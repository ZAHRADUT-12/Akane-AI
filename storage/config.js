import "dotenv/config";

import fs from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";
import Function from "../system/lib/function.js";

//—————「 Setings your bot 」—————//
global.name = "Akane - Bot";
global.wm = "Copyright © 2024 AkaneBot";

global.author = "Arifzyn";
global.packname = "Created Sticker By";
global.link = "https://akanebot.xyz";

global.owner = ["6285691464024", "62895347198105", "6287760363490"];
global.pairingNumber = "62856914640248";

global.session = process.env.SESSION || "session";
global.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i;
global.thumbnail = fs.readFileSync("./storage/media/images.jpg");
global.ucapan = Function.timeSpeech();
global.func = Function;

global.msg = {
  owner: "Fitur ini hanya dapat diakses oleh pemilik!",
  group: "Fitur ini hanya dapat diakses di dalam grup!",
  private: "Fitur ini hanya dapat diakses di chat pribadi!",
  admin: "Fitur ini hanya dapat diakses oleh admin grup!",
  botAdmin: "Bot bukan admin, tidak dapat menggunakan fitur ini!",
  bot: "Fitur ini hanya dapat diakses oleh bot",
  premium: "Fitur ini hanya dapat diakses oleh pengguna premium",
  media: "Balas ke media...",
  query: "Tidak ada query?",
  error: "Sepertinya terjadi kesalahan yang tidak terduga, silakan ulangi perintah Anda beberapa saat lagi",
  quoted: "Balas ke pesan...",
  wait: "Tunggu sebentar...",
  urlInvalid: "URL tidak valid",
  notFound: "Hasil tidak ditemukan!",
  register: "Anda belum terdaftar, silakan lakukan pendaftaran terlebih dahulu untuk menggunakan fitur ini.",
};

global.APIs = {
  arifzyn: "https://api.arifzyn.tech",
  rose: "https://api.itsrose.rest",
  xyro: "https://api.xyro.fund",
  akane: "https://akane.my.id",
  itzpire: "https://www.itzpire.com",
};

global.APIKeys = {
  "https://api.arifzyn.tech": process.env.AR_KEY || "",
  "https://api.itsrose.rest": process.env.ROSE_KEY || "",
  "https://api.xyro.fund": "xyroKey",
};

global.API = (name, path = "/", query = {}, apikeyqueryname) => {
  const baseUrl = name in global.APIs ? global.APIs[name] : name;
  const apiKey = apikeyqueryname ? global.APIKeys[baseUrl] : "";
  const queryParams = new URLSearchParams({
    ...query,
    ...(apikeyqueryname && apiKey ? { [apikeyqueryname]: apiKey } : {}),
  });

  return baseUrl + path + (queryParams.toString() ? "?" + queryParams : "");
};

//—————「 Don"t change it 」—————//
let file = fileURLToPath(import.meta.url);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update config.js"));
  import(`${file}?update=${Date.now()}`);
});
