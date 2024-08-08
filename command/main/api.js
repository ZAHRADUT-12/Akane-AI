export default {
  command: ["apikey", "chekapikey"],
  description: "",
  name: ["apikey", "chekapikey"],
  tags: "main",

  run: async (m, { conn }) => {
    try {
      const apikeys = m.text || global.APIKeys[APIs["arifzyn"]];
      if (!apikeys) {
        return m.reply("apikey is required");
      }

      const response = await func.fetchJson(
        API("arifzyn", "/checkApikey", { apikey: apikeys }),
      );

      const { email, apikey, limit, premium, premiumTime, username } =
        response.result;

      const censor = (text) => {
        const length = text.length;
        return text[0] + "*".repeat(length - 2) + text[length - 1];
      };

      const censoredEmail = censor(email);
      const censoredApikey = censor(apikey);

      const infoMessage = `
Username: ${username}        
Email: ${censoredEmail}
API Key: ${censoredApikey}
Limit: ${premium ? "Unlimited" : limit}
Premium: ${premium ? "Yes" : "No"}
Premium Time: ${premiumTime}
        `;
      m.reply(infoMessage);
    } catch (error) {
      m.reply(func.format(error));
    }
  },
};
