export default {
  command: ["setlife"],
  description: "Set your life details",
  name: "setlife",
  tags: "utility",

  run: async (m, { conn }) => {
    const user = global.db.data.users[m.sender].life;

    if (!m.text) {
      m.reply(`Contoh : ${m.prefix + m.command} name,gender,age`);
      return;
    }

    if (
      user.name.length > 1 ||
      user.gender.length > 1 ||
      !user.age.length > 1
    ) {
      m.reply("⚠️ Sepertinya Kamu sudah melakukan sebelumnya.");
      return;
    }

    const [name, gender, age] = m.text.split(",");

    if (!name || !gender || !age) {
      m.reply(
        `Contoh :\n\n${m.prefix + m.command} name,gender,age\n${m.prefix + m.command} Arifzyn,male,18\n\nNote :\nSet life hanya bisa satu kali ya, jadi kamu tidak bisa mengubahnya.`,
      );
      return;
    }

    if (!["male", "female"].includes(gender)) {
      m.reply("⚠️Gender hanya bisa (male dan female)");
      return;
    }

    if (isNaN(age)) {
      m.reply("⚠️ Age harus berupa angka.");
      return;
    }

    await m.reply(
      `*Berhasil set Life*\n\nName : ${name}\nGender : ${gender}\nAge : ${age}\n\nSelamat Menikmati keseharian mu🥰.`,
    );
    user.name = name;
    user.gender = gender;
    user.age = age;
    user.verified = true;
  },
};
