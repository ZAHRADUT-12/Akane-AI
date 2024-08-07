export default {
  command: ["menu", "help"],
  description: "Menampilkan list menu",
  name: ["menu", "help"],
  tags: "main",

  run: async (m, { conn, args }) => {
    const selectedCategory = args[0];

    if (!selectedCategory) {
      let body = `🤖 Hai @${m.sender.split("@")[0]}, selamat datang di Akane-Bot, asisten pribadi Anda di WhatsApp! Temukan berbagai fitur yang disesuaikan dengan kebutuhan Anda\n`;
      const categories = new Set();

      for (const [filePath, command] of Object.entries(global.plugins)) {
        const cmd = command.default || command;
        if (
          !cmd ||
          !cmd.command ||
          !Array.isArray(cmd.command) ||
          !cmd.command[0]
        ) {
          continue;
        }

        const category = cmd.tags || "General";
        categories.add(category);
      }

      body += "\nKategori yang tersedia:\n";
      Array.from(categories).forEach((category) => {
        body += `- ${category}\n`;
      });

      body += `\nGunakan *${m.prefix + m.command} <category>* untuk melihat menu kategori\nContoh: *${m.prefix + m.command} main*`;

      await conn.sendFThumb(
        m.chat,
        "Akane-Bot",
        body,
        "https://telegra.ph/file/fa1510a4a58687ef9a234.jpg",
        global.link,
        m,
      );
    } else {
      let body = `Hai, @${m.sender.split("@")[0]} Berikut adalah daftar menu ${selectedCategory === "all" ? "semua kategori" : selectedCategory}\n`;

      if (selectedCategory.toLowerCase() === "all") {
        // Mengelompokkan perintah berdasarkan kategori
        const commandsByCategory = {};

        for (const [filePath, command] of Object.entries(global.plugins)) {
          const cmd = command.default || command;
          if (
            !cmd ||
            !cmd.command ||
            !Array.isArray(cmd.command) ||
            !cmd.command[0]
          ) {
            continue;
          }

          const category = cmd.tags || "General";
          if (!commandsByCategory[category]) {
            commandsByCategory[category] = [];
          }
          commandsByCategory[category].push(cmd);
        }

        // Menampilkan perintah yang dikelompokkan berdasarkan kategori
        for (const category in commandsByCategory) {
          body += `\n*${func.toUpper(category)} Feature*\n`;
          commandsByCategory[category].forEach((cmd, index) => {
            const names = Array.isArray(cmd.name) ? cmd.name : [cmd.name];
            names.forEach((name) => {
              body += `${index + 1}. ${m.prefix + name}: ${cmd.description || "No description"}\n`;
            });
          });
        }
      } else {
        // Menampilkan perintah dalam kategori yang dipilih
        const commandsInCategory = [];

        for (const [filePath, command] of Object.entries(global.plugins)) {
          const cmd = command.default || command;
          if (
            !cmd ||
            !cmd.command ||
            !Array.isArray(cmd.command) ||
            !cmd.command[0]
          ) {
            continue;
          }

          const category = cmd.tags || "General";
          if (category.toLowerCase() === selectedCategory.toLowerCase()) {
            commandsInCategory.push(cmd);
          }
        }

        body += `\n*${func.toUpper(selectedCategory)} Feature*\n`;
        commandsInCategory
          .filter((cmd) => {
            const names = cmd.name;
            return Array.isArray(names)
              ? names.length > 0
              : names !== undefined && names !== null && names !== "";
          })
          .forEach((cmd, index) => {
            const names = Array.isArray(cmd.name) ? cmd.name : [cmd.name];
            names.forEach((name) => {
              body += `${index + 1}. #${name}: ${cmd.description || "No description"}\n`;
            });
          });

        if (commandsInCategory.length === 0) {
          body += `\nNo commands found in the ${selectedCategory} category.`;
        }
      }

      body += `\nCreate With ❤️ Made By Arifzyn.`;

      await m.reply(body, {
        contextInfo: {
          mentionedJid: [m.sender],
          groupMentions: [],
          forwardingScore: 1,
          isForwarded: true,
          externalAdReply: {
            showAdAttribution: true,
            title: "Akane-Bot",
            body: "Powered By Arifzyn.",
            thumbnailUrl: "https://telegra.ph/file/fa1510a4a58687ef9a234.jpg",
            sourceUrl: global.API("akane"),
            mediaType: 1,
            renderLargerThumbnail: true,
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363189539738060@newsletter",
            newsletterName: "Arifzyn Information",
          },
        },
      });
    }
  },
};
