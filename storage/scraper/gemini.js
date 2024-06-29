import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async runGeminiPro(prompt) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  }

  fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(path).toString("base64"),
        mimeType,
      },
    };
  }

  async runGeminiVision(prompt, path, mimeType) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const imageParts = [this.fileToGenerativePart(path, mimeType)];
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
  }
}

export default GeminiAI;