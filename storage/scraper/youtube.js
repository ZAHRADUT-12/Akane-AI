/**
@credit Tio
@yotube downloader
**/

import axios from "axios";

class Ytdl {
  constructor() {
    this.baseUrl = "https://id-y2mate.com";
  }

  async search(url) {
    const requestData = new URLSearchParams({
      k_query: url,
      k_page: "home",
      hl: "",
      q_auto: "0",
    });

    const requestHeaders = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
      "X-Requested-With": "XMLHttpRequest",
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/mates/analyzeV2/ajax`,
        requestData,
        {
          headers: requestHeaders,
        },
      );

      const responseData = response.data;
      return responseData;
    } catch (error) {
      if (error.response) {
        console.error(`HTTP error! status: ${error.response.status}`);
      } else {
        console.error("Axios error: ", error.message);
      }
    }
  }

  async convert(videoId, key) {
    const requestData = new URLSearchParams({
      vid: videoId,
      k: key,
    });

    const requestHeaders = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
      Referer: `${this.baseUrl}/youtube/${videoId}`,
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/mates/convertV2/index`,
        requestData,
        {
          headers: requestHeaders,
        },
      );

      const responseData = response.data;
      return responseData;
    } catch (error) {
      if (error.response) {
        console.error(`HTTP error! status: ${error.response.status}`);
      } else {
        console.error("Axios error: ", error.message);
      }
    }
  }

  async play(url) {
    const searchResult = await this.search(url);
    if (!searchResult) {
      throw new Error("Error in searching video.");
    }

    const { links, vid, title } = searchResult;
    let video = {};
    let audio = {};

    if (links && links.mp4) {
      for (let i in links.mp4) {
        let input = links.mp4[i];
        let convertResult = await this.convert(vid, input.k);
        if (convertResult) {
          const { fquality, dlink } = convertResult;
          video[fquality] = {
            size: input.q,
            url: dlink,
          };
        }
      }
    }

    if (links && links.mp3) {
      for (let i in links.mp3) {
        let input = links.mp3[i];
        let convertResult = await this.convert(vid, input.k);
        if (convertResult) {
          const { fquality, dlink } = convertResult;
          audio[fquality] = {
            size: input.q,
            url: dlink,
          };
        }
      }
    }

    return { title, video, audio };
  }
}

export default new Ytdl();
