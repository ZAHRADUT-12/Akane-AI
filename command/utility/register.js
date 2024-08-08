export default {
    command: ["register", "daftar"],
    description: "Register Your data.",
    name: "daftar", 
    tags: "utility",

    run: async (m, { conn }) => {
        const user = global.db.data.users[m.sender];
        
        if (user.registered === true) {
            return m.reply("[!] Kamu sudah terdaftar.");
        }
        
        const [name, age, gender] = m.text.split(",");
        
        if (!name || !age || !gender) {
            return m.reply("Format salah! Gunakan: nama,umur,gender\nContoh: Arifzyn,18,male");
        }

        if (isNaN(age) || age < 10 || age > 100) {
            return m.reply("Umur harus berupa angka antara 10-100.");
        }

        if (!["male", "female"].includes(gender.toLowerCase())) {
            return m.reply("Gender harus 'male' atau 'female'.");
        }
        
        user.name = name.trim();
        user.age = parseInt(age);
        user.gender = gender.trim().toLowerCase();
        user.registered = true;
        user.regTime = new Date().getTime();

        m.reply(`Registrasi berhasil!\n\nNama: ${user.name}\nUmur: ${user.age}\nGender: ${user.gender}`);
    }
};