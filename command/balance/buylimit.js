export default {
	command: ["buylimit", "blimit"],
	description: "Membeli limit menggunakan balance",
	name: "buylimit",
	tags: "balance", 
	
	run: async (m, { conn, args }) => {
		if (args.length < 1) {
			return m.reply(`Usage: ${m.prefix+m.command} <jumlah_limit>`);
		} 
		
		let jumlahLimit = parseInt(args[0]);
		let hargaPerLimit = 1000;

		if (isNaN(jumlahLimit) || jumlahLimit <= 0) {
			return m.reply("Jumlah limit yang ingin dibeli harus berupa angka positif.");
		}

		let senderId = m.sender;
		let sender = global.db.data.users[senderId];

		if (!sender) {
			return m.reply("Pengguna tidak ditemukan dalam database.");
		}

		let totalHarga = jumlahLimit * hargaPerLimit;

		if (sender.balance < totalHarga) {
			return m.reply("Balance Anda tidak mencukupi untuk membeli limit ini.");
		}

		// Lakukan pembelian
		sender.balance -= totalHarga;
		sender.limit = (sender.limit || 0) + jumlahLimit;

		m.reply(`Pembelian berhasil! Anda telah membeli ${jumlahLimit} limit dengan total harga ${func.toDollar(totalHarga)}.\nBalance Anda sekarang: ${func.toDollar(sender.balance)}\nLimit Anda sekarang: ${sender.limit}`);
	}
}