export async function before(m) {  
    if (!m.chat.endsWith('@s.whatsapp.net')) return;
    
    const ftextt = {
      key: {
        participant: "0@s.whatsapp.net",
        ...(m.from ? { remoteJid: `0@s.whatsapp.net` } : {}),
      },
      message: {
        extendedTextMessage: {
          text: "Anonymous Chat...",
          title: "",
        },
      },
    };
    
    this.anonymous = this.anonymous || {};
    let room = Object.values(this.anonymous).find(room => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING');
     
    if (room) {
        if (/^(next|leave|start|skip)$/i.test(m.text)) return;
        
        if (['.next', '.leave', '.start', '.skip', 'Cari Partner', 'Keluar', 'Next'].includes(m.text)) return;

        let other = [room.a, room.b].find(user => user !== m.sender);
        const quoted = m.quoted ? m.quoted : m
         
        if (quoted.isMedia) {
            let mediaBuffer = await quoted.download();
            await m.reply(mediaBuffer, {
            	from: other, 
                caption: quoted.text,
                quoted: ftextt, 
                contextInfo: {
                    ...m.msg.contextInfo,
                    forwardingScore: 1,
                    isForwarded: true,
                    participant: m.sender
                }
            });  
        } else {
            await m.reply(m.body, {
            	from: other,
            	quoted: ftextt, 
                contextInfo: {
                    ...m.msg.contextInfo,
                    forwardingScore: 1,
                    isForwarded: true,
                    participant: m.sender
                }
            });
        }
    }
    
    return !0
}