export default {
  command: ["start", "leave", "next", "skip"],
  description: "Anonymous Chat (Frends)",
  name: ["start", "leave", "next", "skip"],

  private: true,

  run: async (m, { conn, command }) => {
    command = command.toLowerCase();
    
    const ftextt = {
      key: {
        participant: "0@s.whatsapp.net",
        ...{ remoteJid: `0@s.whatsapp.net` },
      },
      message: { 
        extendedTextMessage: {
          text: "Anonymous Chat...",
          title: "",
        },
      },
    };
    
    conn.anonymous = conn.anonymous ? conn.anonymous : {};
    
    switch (command) {
      case "next":
      case "skip":
      case "leave": {
        let room = Object.values(conn.anonymous).find((room) =>
          room.check(m.sender),
        );
        if (!room)
          return conn.sendQuick(
            m.chat,
            "Kamu tidak sedang berada di anonymous chat",
            wm,
            "",
            [["Cari Partner", `.start`]],
            ftextt,
          );
        m.reply("Ok");
        let other = room.other(m.sender);
        if (other)
          await conn.sendQuick(
            other,
            "Partner meninggalkan chat",
            wm,
            "",
            [["Cari Partner", `.start`]],
            ftextt,
          ); 
        delete conn.anonymous[room.id];
        if (command === "leave") break;
      }
      case "start": {
        if (Object.values(conn.anonymous).find((room) => room.check(m.sender)))
          return conn.sendQuick(
            m.chat,
            "Kamu masih berada di dalam anonymous chat, menunggu partner",
            wm,
            [["Keluar", `.leave`]],
            ftextt,
          );
        let room = Object.values(conn.anonymous).find(
          (room) => room.state === "WAITING" && !room.check(m.sender),
        );
        if (room) {
          await conn.sendQuick(
            room.a,
            "Partner ditemukan!",
            wm,
            "",
            [["Next", `.next`]],
            ftextt,
          );
          room.b = m.sender;
          room.state = "CHATTING";
          await conn.sendQuick(
            room.b,
            "Partner ditemukan!",
            wm,
            "",
            [["Next", `.next`]],
            ftextt,
          );
        } else {
          let id = +new Date();
          conn.anonymous[id] = {
            id,
            a: m.sender,
            b: "",
            state: "WAITING",
            check: function (who = "") {
              return [this.a, this.b].includes(who);
            },
            other: function (who = "") {
              return who === this.a ? this.b : who === this.b ? this.a : "";
            },
          };
          await conn.sendQuick(
            m.chat,
            "Menunggu partner...",
            wm,
            "",
            [["Keluar", `.leave`]],
            ftextt,
          );
        }
        break;
      }
    }
  },
};
