import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import tmp from "tmp";

class GeminiAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.fileManager = new GoogleAIFileManager(apiKey);
  }

  async runGeminiPro(prompt) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return text;
  }

  async uploadToGemini(buffer, mimeType) {
    const tmpFile = tmp.fileSync();
    fs.writeFileSync(tmpFile.name, buffer);

    const { file } = await this.fileManager.uploadFile(tmpFile.name, {
      mimeType,
      displayName: "uploadedFile",
    });
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }

  async waitForFilesActive(files) {
    console.log("Waiting for file processing...");
    for (const { name } of files) {
      let file = await this.fileManager.getFile(name);
      while (file.state === "PROCESSING") {
        process.stdout.write(".");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        file = await this.fileManager.getFile(name);
      }
      if (file.state !== "ACTIVE")
        throw new Error(`File ${name} failed to process`);
    }
    console.log("...all files ready\n");
  }

  fileToGenerativePart(buffer, mimeType) {
    return {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType,
      },
    };
  }

  async runGeminiVision(prompt, buffer) {
    const { mime } = await fileTypeFromBuffer(buffer);
    const files = [await this.uploadToGemini(buffer, mime)];
    await this.waitForFilesActive(files);

    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const imageParts = [this.fileToGenerativePart(buffer, mime)];
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  async geminiPro(prompt, buffer) {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
    };
    const { mime } = await fileTypeFromBuffer(buffer);
    const files = [await this.uploadToGemini(buffer, mime)];
    await this.waitForFilesActive(files);

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: { mimeType: files[0].mimeType, fileUri: files[0].uri },
            },
          ],
        },
        { role: "user", parts: [{ text: prompt }] },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  }
}

export default GeminiAI;
