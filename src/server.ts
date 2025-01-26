import cors from "cors";
import dotenv from "dotenv";
import express, { RequestHandler } from "express";
import { PassThrough, Readable } from "stream";
import { ChatRequest, DeepSeekRequest, ModelsResponse } from "./types";
import { convertMessages, convertToolChoice } from "./utils";

dotenv.config();

const app = express();
const port = 9000;

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com";
const DEEPSEEK_CHAT_MODEL = "deepseek-chat";
const GPT4O_MODEL = "gpt-4o";

const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

if (!deepseekApiKey) {
  console.error("DEEPSEEK_API_KEY environment variable is required");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// Middleware to validate API key
const validateApiKey: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const userApiKey = authHeader.slice(7);
  if (userApiKey !== deepseekApiKey) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  next();
};

app.use(validateApiKey);

// Models endpoint
const getModels: RequestHandler = (req, res) => {
  const modelsResponse: ModelsResponse = {
    object: "list",
    data: [
      {
        id: GPT4O_MODEL,
        object: "model",
        created: Date.now(),
        owned_by: "deepseek",
      },
      {
        id: DEEPSEEK_CHAT_MODEL,
        object: "model",
        created: Date.now(),
        owned_by: "deepseek",
      },
    ],
  };

  res.json(modelsResponse);
};

app.get("/v1/models", getModels);

// Chat completions endpoint
const handleChatCompletions: RequestHandler = async (req, res) => {
  try {
    const chatReq: ChatRequest = req.body;
    console.log("Received chat request:", JSON.stringify(chatReq, null, 2));

    const deepseekReq: DeepSeekRequest = {
      model: DEEPSEEK_CHAT_MODEL,
      messages: convertMessages(chatReq.messages),
      stream: chatReq.stream || false,
      temperature: chatReq.temperature,
      max_tokens: chatReq.max_tokens,
      tool_choice: convertToolChoice(chatReq.tool_choice),
    };

    // Only add tools if they exist
    if (chatReq.tools || chatReq.functions) {
      deepseekReq.tools =
        chatReq.tools ||
        chatReq.functions?.map((f) => ({ type: "function", function: f }));
    }

    const response = await fetch(`${DEEPSEEK_ENDPOINT}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deepseekApiKey}`,
        Accept: chatReq.stream ? "text/event-stream" : "application/json",
      },
      body: JSON.stringify(deepseekReq),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("DeepSeek API error:", error);
      res.status(response.status).json({ error });
      return;
    }

    if (chatReq.stream) {
      // Handle streaming response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = new PassThrough();
      if (response.body) {
        const readable = Readable.fromWeb(response.body as any);
        readable.pipe(stream);
      }

      stream.on("data", (chunk) => {
        res.write(chunk);
      });

      stream.on("end", () => {
        res.end();
      });

      stream.on("error", (error) => {
        console.error("Stream error:", error);
        res.end();
      });

      // Handle client disconnect
      req.on("close", () => {
        stream.destroy();
      });
    } else {
      // Handle regular response
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

app.post("/v1/chat/completions", handleChatCompletions);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
