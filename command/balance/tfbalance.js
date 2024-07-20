export default {
	command: ["transferbalance", "tfbalance"],
	description: "Transfer balance dari satu pengguna ke pengguna lain",
	name: "transferbalance",
	tags: "balance", 
	
	run: async (m, { conn, args }) => {
		if (args.length < 2) {
			return m.reply(`Usage: ${m.prefix+m.command} <amount> <@target_user>`);
		}
		
		let amount = parseFloat(args[0]);
		let targetUser = args[1]
			? args[1].replace(/[@ .+-]/g, "") + "@s.whatsapp.net"
			: m.quoted
				? m.quoted.sender
				: m.mentions && m.mentions[0]
					? m.mentions[0]
					: "";

		if (isNaN(amount) || amount <= 0) {
			return m.reply("Jumlah yang ditransfer harus berupa angka positif.");
		}
		
		let senderId = m.sender;
		let sender = global.db.data.users[senderId];
		let receiver = global.db.data.users[targetUser];
		
		if (!sender) {
			return m.reply("Pengirim tidak ditemukan dalam database.");
		}
		
		if (!receiver) {
			return m.reply("Penerima tidak ditemukan dalam database.");
		}
		
		if (sender.balance < amount) {
			return m.reply("Balance Anda tidak mencukupi untuk transfer ini.");
		}
		
		// Lakukan transfer
		sender.balance -= amount;
		receiver.balance += amount;
		
		m.reply(`Transfer berhasil! Anda telah mentransfer ${func.toDollar(amount)} kepada ${await conn.getName(targetUser)}.\nBalance Anda sekarang: ${func.toDollar(sender.balance)}`);
	}
}