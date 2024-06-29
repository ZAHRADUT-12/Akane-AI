import axios from 'axios';
import FormData from 'form-data';

const apikey = [
  't4DJWibUPdxTbCiZs6wXUTMB',
  'Divb33Vh3YANNFJMPkv4QJs3',
  '61N7EMLJURGuTdYpavHwkWTC'
];

const getRandomApiKey = () => {
  const randomIndex = Math.floor(Math.random() * apikey.length);
  return apikey[randomIndex];
};

const handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mime || "";

  if (!/image/.test(q.mime)) {
    return m.reply(
      "Usage:\nBalas pesan bertipe Foto / Gambar dengan caption ↓\n!removebg"
    );
  }

  m.reply("wait");
  const media = await q.download();

  try {
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', media, Date.now() + '.jpg'); // Assuming the file name is 'image.jpg'

    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': getRandomApiKey()
      },
      encoding: null
    });

    if (response.status !== 200) {
      console.error('Error:', response.status, response.statusText);
      return m.reply("Failed to remove background. Please try again later.");
    }

    const image = Buffer.from(response.data, 'binary');
    await m.reply(image)

  } catch (error) {
    console.error('Request failed:', error);
    await m.reply("Failed to remove background. Please try again later.");
  }
};

export default {
  command: ["removebg", "remove_bg"],
  description: "Remove background from an image",
  name: "removebg",
  tags: "tools",
  limit: 1, 
  run: handler,
};