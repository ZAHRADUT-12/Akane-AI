export default {
	command: ["drakor"],
	description: "Search for Korean drama",
	name: "drakor",
	tags: "search",
	
	limit: true,
	
	run: async (m, { conn, text }) => {
		let response;
		let teks = ''; // Inisialisasi teks dengan string kosong
		
		if (func.isUrl(text)) {
			try {
				response = await func.fetchJson(API("arifzyn", "/search/drakor-get", { url: text }, "apikey"));
				
				if (!response.result) {
					return m.reply("No Korean drama found with that URL.");
				}
				
				const { thumbnail, title, detail, release, genre, duration, channel, cast, sinopsis, episodes } = response.result;
				
				teks += `Title: ${title}\n`;
				teks += `Detail: ${detail}\n`;
				teks += `Release: ${release}\n`;
				teks += `Duration: ${duration}\n`;
				teks += `Channel: ${channel}\n`;
				teks += `Genre: ${genre.join(", ")}\n`;
				teks += `Cast: ${cast.join(", ")}\n`;
				teks += `Synopsis: ${sinopsis}\n\n`;
				teks += `Episodes:\n`;
				
				for (let episode of episodes) {
					teks += `\n${episode.episode}:\n`;
					for (let url of episode.urls) {
						teks += `- ${url.provider}: ${url.url}\n`;
					}
				}
				
				m.reply(thumbnail, { caption: teks.trim() });
			} catch (error) {
				return m.reply("An error occurred while fetching the data. Please try again later.");
			}
		} else if (text.length > 1) {
			try {
				response = await func.fetchJson(API("arifzyn", "/search/drakor", { query: text }, "apikey"));
				
				if (!response.result || response.result.length === 0) {
					return m.reply("No Korean drama found with that name.");
				}
					 
				for (let x of response.result) {
					teks += `Title: ${x.title}\n`;
					teks += `Episode: ${x.episode}\n`;
					teks += `Release: ${x.release}\n`;
					teks += `URL: ${x.url}\n\n`;
				}
				
				m.reply(teks.trim());
			} catch (error) {
				return m.reply("An error occurred while fetching the data. Please try again later.");
			}
		} else {
			return m.reply("Please enter text or URL.");
		}
	}
}