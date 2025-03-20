import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      schema: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()),
            answer: z.string(),
          })
        ).min(10),
      }),
      prompt: `Generate at least 10 quiz questions about JavaScript. 
        Each question should have 5 options and one correct answer.`,
    });

    res.status(200).json(object);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
