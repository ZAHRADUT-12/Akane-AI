import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

export default {
  command: ['ytmp3', 'ytmp4'],
  description: 'Download video/audio dari YouTube',
  name: ['ytmp3', 'ytmp4'],
  tags: 'download',
  
  example: "[!] Silakan masukkan URL video/audio.\n\nContoh: %p%cmd https://youtube.com/watch?v=TicGJQqrq2M",
  
  run: async (m, { conn }) => {
    const url = m.text;
    if (!func.isUrl(url)) {
      return m.reply("[!] Silakan masukkan URL video/audio YouTube.");
    }

    try {
      const isAudio = (m.command === 'ytmp3');
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title;
      const extension = isAudio ? 'mp3' : 'mp4';
      const filename = `${title}.${extension}`;
      const filePath = path.join(_dirname, "../../", "storage", "tmp", filename);

      console.log(filePath);
      
      const streamOptions = isAudio ? { filter: 'audioonly' } : { quality: 'highest' };
      const fileStream = fs.createWriteStream(filePath);
 
      const videoStream = ytdl(url, streamOptions);
      videoStream.pipe(fileStream);

      fileStream.on('finish', async () => {
        const mediaFile = fs.readFileSync(filePath)
        await conn.sendMedia(m.chat, mediaFile, m, { mimetype: isAudio ? 'audio/mpeg' : 'video/mp4', fileName: filename });
      });

      fileStream.on('error', (err) => {
        console.error(`Error writing file ${filePath}:`, err);
        m.reply('Terjadi kesalahan saat menulis file.');
      });
    } catch (error) {
      console.error('Error downloading YouTube video:', error);
      m.reply('Terjadi kesalahan saat memproses permintaan download.');
    }
  }
};