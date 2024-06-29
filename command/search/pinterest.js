export default {
  command: ['pinterest', 'pin'],
  description: 'Search images/download from pin',
  name: 'pinterest',
  tags: 'search',
  limit: 1,
  example: "Contoh: %p%pinterest Nakano Miku / https://pin.it/4SFz8TYxp",
  
  run: async (m, { args }) => {
    try {
      if (func.isUrl(m.text)) {
        const downloadResponse = await func.fetchJson(API("itzpire", `/download/pinterest?url=${encodeURIComponent(func.isUrl(m.text)[0])}`));
        if (downloadResponse.status === 'success' && downloadResponse.data) {
          const { image, video } = downloadResponse.data;
          const caption = `Source from: ${m.text}`;
          if (image) {
            m.reply(image[0], { caption });
          } else if (video) {
            m.reply(video[0], { caption });
          } else {
            m.reply('Maaf, tidak dapat menemukan gambar atau video untuk URL ini.');
          }
        } else { 
          m.reply('Maaf, tidak dapat mengunduh gambar atau video untuk URL ini.');
        }
      } else {
        const query = encodeURIComponent(m.text);
        const response = await func.fetchJson(API("itzpire", `/search/pinterest?query=${query}`));
        if (response.status === 'success' && response.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.length);
          const imageUrl = response.data[randomIndex];
          const caption = `Query from: ${m.text}`;
          m.reply(imageUrl, { caption });
        } else {
          m.reply('Maaf, tidak dapat menemukan gambar untuk permintaan ini.');
        }
      }
    } catch (e) {
      console.error(e);
      m.reply('Terjadi kesalahan saat memproses permintaan.');
    }
  }
};