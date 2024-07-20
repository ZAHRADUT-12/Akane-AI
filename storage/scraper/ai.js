import axios from 'axios';
import crypto from 'crypto';

const getRandomIP = () => {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

async function getChatCompletion(messages) {
  try {
    const authResponse = await axios.post('https://tudouai.chat/api/auth/nick_login', {
      fingerprint: crypto.randomBytes(16).toString('hex')
    }, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://tudouai.chat/chat'
      }
    });
    
    const chatResponse = await axios.post('https://tudouai.chat/api/v1/chat/completions', {
      model: "gpt-3.5-turbo-0125",
      messages,
      stream: true
    }, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': authResponse.data.token
      },
      responseType: 'stream'
    });
    let content = '';
    return new Promise((resolve, reject) => {
      chatResponse.data.on('data', chunk => {
        const lines = chunk.toString().split('\n').filter(line => line.trim());
        for (const line of lines) {
          if (line === 'data: [DONE]') {
            resolve(content);
          } else {
            try {
              const parsed = JSON.parse(line.replace(/^data: /, ''));
              const delta = parsed.choices[0].delta;
              if (delta && delta.content) {
                content += delta.content;
              }
            } catch (error) {
              reject(error);
            }
          }
        }
      });
      chatResponse.data.on('end', () => resolve(content));
      chatResponse.data.on('error', error => reject(error));
    });

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
@credit Tio
@ai chatgpt free
**/

async function chatgpt(text) {
    try {
        const { data: res } = await axios.post("https://chatgpt4online.org/wp-json/mwai/v1/start_session", {}, {
            headers: {
                'Content-Type': 'application/json',
                "x-forwarded-for": await getRandomIP()
            }
        });

        const url = 'https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit';
        const data = {
            botId: "chatbot-qm966k",
            customId: null,
            session: "N/A",
            messages: [{ role: "user", content: text }],
            newMessage: text,
            stream: false
        };

        const headers = {
            'Content-Type': 'application/json',
            'X-WP-Nonce': res.restNonce,
            "x-forwarded-for": await getRandomIP()
        };

        const response = await axios.post(url, data, { headers });

        return {
            status: response.status,
            code: response.data.code || "N/A",
            data: response.data.reply
        };
    } catch (error) {
        console.error('Axios Error:', error);

        return {
            status: error.response ? error.response.status : 500,
            code: error.code || "ERROR",
            data: error.message
        };
    }
}

export default {
	getChatCompletion,
	chatgpt,
}

