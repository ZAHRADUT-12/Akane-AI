import axios from 'axios';
import fs from 'fs';
import mime from 'mime-types';

export default {
  command: ["quote", "quotly", "qc"],
  description: "Generate a quote image",
  example: "Contoh: %p%cmd <text>", // %p = prefix, %cmd = command, %text = teks
  name: "quote",
  tags: "utility",

  run: async (m, { conn }) => {
    const text = m.text;

    if (!text)
      return m.reply(
        `Invalid input\n\nContoh: ${m.prefix + m.command} Hello World`
      );

    const username = m.pushName || "Unknown";
    const avatar = await conn.profilePictureUrl(m.sender);

    const json = {
      "type": "quote",
      "format": "png",
      "background": "#ffff",
      "backgroundColor": "#000000", // Dark background color
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [
        {
          "entities": [],
          "avatar": true,
          "from": {
            "id": 1,
            "name": username,
            "photo": {
              "url": avatar
            }
          },
          "text": text,
          "replyMessage": {}
        }
      ]
    };

    // If the message is a reply to another message, add the quoted message
    if (m.quoted) {
      const quotedUsername = m.quoted.pushName || "Unknown";
      const quotedAvatar = await conn.profilePictureUrl(m.quoted.sender);
      json.messages[0].replyMessage = {
        "entities": [],
        "avatar": true,
        "from": {
          "id": 2,
          "name": quotedUsername,
          "photo": {
            "url": quotedAvatar
          }
        },
        "text": m.quoted.text
      };
    }

    await m.reply("Tunggu sebentar...");

    try {
      const response = await axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {'Content-Type': 'application/json'}
      });

      const buffer = Buffer.from(response.data.result.image, 'base64');
      
      m.reply(buffer, { asSticker: true })
    } catch (err) {
      conn.logger.error(`Error generating quote:`, err);
      return m.reply("An error occurred while generating the quote.");
    }
  },
};