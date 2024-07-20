export default {
    command: ["ai"],
    description: "Mengirim pesan ke ChatGPT dan mendapatkan balasan",
    name: "ai",
    tags: "ai",

    run: async (m, { conn, text }) => {
        try {
            const result = await scraper.ai.chatgpt(text || "Hai");
            conn.reply(m.chat, result.data.trim(), m);
        } catch (error) {
            conn.reply(m.chat, `Error: ${error.message}`);
        }
    }
};