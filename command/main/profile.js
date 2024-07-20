export default {
	command: ["profile", "me"],
	name: ["profile", "me"],
	tags: "main",
	
	run: async (m) => {
		const user = global.db.data.users[m.sender]; 
		
		const txt = `
Nama: ${user.name || m.pushName}
Status: ${user.premium ? "Premium" : "Gratisan"}
Balance: ${user.balance}
Saldo: ${user.saldo || 0}
Limit: ${user.limit}
`.trim();
		await m.reply(txt);
	}
}