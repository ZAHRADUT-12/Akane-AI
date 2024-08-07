export default {
  command: ["claim", "daily"],
  description: "Claim your daily free balance!",
  name: "claim",
  tags: "main",
  group: false,

  run: async function (m, { conn }) {
    const user = global.db.data.users[m.sender];
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Check if user has exceeded daily claim limit
    if (user.claimCount >= (user.dailyLimit || 10)) {
      return m.reply(
        `Maaf, kamu telah mencapai batas klaim harian (${user.dailyLimit || 10} kali). Coba lagi besok.`,
      );
    }

    const lastClaim = user.lastClaim ? new Date(user.lastClaim) : null;

    // Check if user has already claimed today
    if (lastClaim && now - lastClaim < oneDay) {
      const remainingTime = new Date(oneDay - (now - lastClaim));
      const hours = remainingTime.getUTCHours();
      const minutes = remainingTime.getUTCMinutes();
      const seconds = remainingTime.getUTCSeconds();
      return m.reply(
        `Kamu sudah mengklaim balance hari ini. Coba lagi dalam ${hours} jam ${minutes} menit ${seconds} detik.`,
      );
    }

    // Generate random daily bonus within a range (e.g., 500 to 1500)
    const dailyBonus = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
    const dailyLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Batas harian antara 5 dan 10
    user.balance += dailyBonus;
    user.lastClaim = now.toISOString();

    // Increment claim count and set new daily limit if necessary
    if (!lastClaim || now - lastClaim >= oneDay) {
      user.claimCount = 1;
      user.dailyLimit = dailyLimit;
    } else {
      user.claimCount += 1;
    }

    return m.reply(
      `Selamat! Kamu telah mengklaim ${toDollar(dailyBonus)} balance dan ${user.claimCount}/${user.dailyLimit} kali hari ini.`,
    );
  },

  failed: "Gagal menjalankan perintah %cmd\n\n%error",
  wait: null,
  done: null,
};

// Function to format balance amount
function toDollar(amount) {
  return `$${amount.toLocaleString()}`;
}
