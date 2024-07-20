export default {
    command: ["taruhan"],
    description: "Taruhan (User A) VS (User B)",
    name: "taruhan",
    tags: "games",
    group: true,

    run: async function (m, { conn, text }) {
        if (!text) {
            return m.reply("Siapa yang ingin kamu ajak taruhan?\n\nContoh: .taruhan JUMLAH @MENTION_USER\n.taruhan 10000 @player");
        }

        const [amountStr, userB] = text.split(" ");
        const amount = parseInt(amountStr);

        if (isNaN(amount) || amount <= 0) {
            return m.reply("Jumlah taruhan tidak valid. Harap masukkan jumlah taruhan yang benar.");
        }

        const userA = global.db.data.users[m.sender];
        const balanceA = userA.balance;

        if (balanceA < amount) {
            return m.reply("Maaf, saldo Anda tidak mencukupi untuk taruhan ini.");
        }

        const userBFormatted = userB.replace("@", "").replace("⁨", "").replace("⁩", "") + "@s.whatsapp.net";
        const userBData = global.db.data.users[userBFormatted];

        if (!userBData) {
            return m.reply("User yang Anda tantang tidak ditemukan dalam database.");
        }

        const timeoutDuration = 60000;

        await conn.sendMessage(m.chat, {
            text: `💥 Tantangan Taruhan 💥\n\n${userB.replace("⁨", "").replace("⁩", "")}, @${m.sender.split("@")[0]} menantangmu taruhan sebesar *${amount}*!\n\nBalas dengan "confirm" untuk menerima taruhan atau abaikan untuk menolak.\n\n⌛ Kamu punya waktu 1 menit untuk menjawab!`,
            mentions: [userBFormatted, m.sender]
        });

        const waitForConfirmation = () => {
            return new Promise((resolve) => { 
                const confirmHandler = async (upsert) => {
                    const messages = upsert.messages;
                    if (!messages || !messages[0] || !messages[0].message) return;

                    const msg = messages[0];
                    const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

                    if (msg.key.remoteJid === m.chat && messageContent.toLowerCase() === 'confirm' && msg.key.participant === userBFormatted) {
                        resolve(true);
                    }
                };

                conn.ev.on('messages.upsert', confirmHandler);

                setTimeout(() => {
                    conn.ev.off('messages.upsert', confirmHandler);
                    resolve(false);
                }, timeoutDuration);
            });
        };

        const confirmed = await waitForConfirmation();

        if (confirmed) {
            if (userBData.balance < amount) {
                return m.reply("User yang Anda tantang tidak memiliki saldo mencukupi untuk taruhan ini. Taruhan dibatalkan.");
            }

            const winner = Math.random() < 0.5 ? 'A' : 'B';
            const loser = winner === 'A' ? 'B' : 'A';

            const newBalanceA = winner === 'A' ? balanceA + amount : balanceA - amount;
            const newBalanceB = winner === 'B' ? userBData.balance + amount : userBData.balance - amount;

            global.db.data.users[m.sender].balance = newBalanceA;
            global.db.data.users[userBFormatted].balance = newBalanceB;

            const resultMessage = winner === 'A'
                ? `🏆 Selamat @${m.sender.split("@")[0]}! Kamu memenangkan taruhan sebesar *${amount}*. Saldo baru kamu: ${newBalanceA}.`
                : `🏆 Selamat @${userB.replace("⁨", "").replace("⁩", "")}! Kamu memenangkan taruhan sebesar *${amount}*. Saldo baru kamu: ${newBalanceB}.`;

            m.reply(resultMessage, { mentions: [userBFormatted, m.sender] });
            conn.sendMessage(m.chat, {
                text: resultMessage,
                mentions: [userBFormatted, m.sender]
            });
        } else {
            m.reply("User B tidak mengkonfirmasi taruhan dalam waktu yang ditentukan. Taruhan dibatalkan.");
        }
    },

    failed: "Gagal menjalankan perintah %cmd\n\n%error",
    wait: null,
    done: null,
};