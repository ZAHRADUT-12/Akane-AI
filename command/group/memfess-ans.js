export async function before(m) {
  let quotedId = m.quoted ? m.quoted.id : "";
  let isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false;

  if (!m.body) return;
  if (isCommand) return;

  let menfesschat = db.data.datas.menfesschat;
  let sessionId = Object.keys(menfesschat).find(
    (id) => menfesschat[id].a === m.sender || menfesschat[id].b === m.sender,
  );

  if (!sessionId) return;

  let session = menfesschat[sessionId];
  let target = session.a === m.sender ? session.b : session.a;

  await m.reply(
    `Kamu mendapat balasan nih\n\nPesan Balasan Darinya:\n${m.body}`,
    { from: target, mentions: [target], quoted: null },
  );

  await m.reply(
    `[Sukses membalas]\n\nTertarik mencoba? Ketik .menfessstop untuk berhenti dari sesi ini`,
  );

  return true;
}
