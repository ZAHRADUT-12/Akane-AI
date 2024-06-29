export default {
  command: ['lyrics', 'lirik'],
  description: 'Search lyrics from web',
  name: 'lyrics',
  tags: 'search',
  limit: 1,
  
  example: "Contoh: %p%cmd melukis senja",
  
  run: async (m, { args }) => {
    try {	
    const response = await func.fetchJson(API("itzpire", "/search/lyrics", { query: args.join(' ') }));

    if (response.status === 'success' && response.data) {
      const { title, album, thumb, lyrics } = response.data;
      
      m.reply(thumb, { caption: `Judul: ${title}\nAlbum: ${album}\n\nLyrics:\n${lyrics}` });
    } else {
      m.reply('Maaf, tidak dapat menemukan lirik untuk permintaan ini.');
    }
    } catch (e) {
    	console.error(e)
    	m.reply('error')
    }
  }
};