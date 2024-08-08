export async function before(m) {
    let isCmd = m.body.startsWith(m.prefix);

    if (!m.chat.endsWith('@s.whatsapp.net')) return;
    if (m.isBaileys) return;
    if (isCmd) return;

    const ftextt = {
        key: {
            participant: "0@s.whatsapp.net",
            ...(m.chat ? { remoteJid: `0@s.whatsapp.net` } : {}),
        },
        message: {
            extendedTextMessage: {
                text: "Anonymous Chat...",
                title: "",
            },
        },
    };

    let room = global.db.data.datas.anonymous.find(room => 
        (room.data.a === m.sender || room.data.b === m.sender) && room.status === 'CHATTING'
    );

    if (room) {
        // Hindari eksekusi jika perintah adalah salah satu dari yang dibatasi
        if (/^(next|leave|start|skip)$/i.test(m.text)) return;
        if (['.next', '.leave', '.start', '.skip', 'sendcontact', 'Cari Partner', 'Keluar', 'Next'].includes(m.body)) return;

        let other = room.data.a === m.sender ? room.data.b : room.data.a;
        const quoted = m.quoted ? m.quoted : m;

        // Cek apakah pesan adalah media
        if (quoted.isMedia) {
            let mediaBuffer = await quoted.download();
            await m.reply(mediaBuffer, { 
                from: other, 
                caption: quoted.text,
                quoted: ftextt,
            });
        } else {
            // Kirim pesan teks
            await m.reply(m.body, { 
                from: other,
                quoted: ftextt,
            });
        } 
    }
    
    return true;
}