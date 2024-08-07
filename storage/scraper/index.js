export const scraper = {
  search: await (await import("./search.js")).default,
  youtube: await (await import("./youtube.js")).default,
};
