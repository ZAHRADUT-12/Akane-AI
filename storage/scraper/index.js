export const scraper = {
	ai: await (await import("./ai.js")).default,
	search: await (await import("./search.js")).default,
	youtube: await (await import("./youtube.js")).default
} 