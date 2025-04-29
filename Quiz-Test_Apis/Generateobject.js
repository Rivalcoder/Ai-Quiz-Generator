import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

async function analyzeCodeFiles() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set");
    console.log("Please create a .env.local file with your Google Generative AI API key");
    return;
  }

  const folderPath = "./pdf-inputs"; // Change to your folder path

  try {
    console.log("Started Reading Folder...");

    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      console.error(`Error: Folder '${folderPath}' does not exist`);
      return;
    }

    // Read all files in the folder
    const files = fs.readdirSync(folderPath);

    // Filter only code files
    const codeFiles = files.filter(
      (file) =>
        file.endsWith(".js") ||
        file.endsWith(".py") ||
        file.endsWith(".jsx") ||
        file.endsWith(".ts") ||
        file.endsWith(".tsx") ||
        file.endsWith(".java") ||
        file.endsWith(".c") ||
        file.endsWith(".cpp") ||
        file.endsWith(".cs") ||
        file.endsWith(".go") ||
        file.endsWith(".rb"),
    );

    if (codeFiles.length === 0) {
      console.log("No valid code files found in the folder.");
      return;
    }

    console.log(`Found ${codeFiles.length} code files to analyze.`);

    // Build messages array for the AI
    const content = [{ type: "text", text: "Explain the following code files in detail:" }];

    // Read each file and add its content to messages
    for (const file of codeFiles) {
      const filePath = path.join(folderPath, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      if (!fileContent) {
        console.log(`Warning: Empty content in file ${file}`);
        continue; // Skip empty files
      }

      content.push({
        type: "text",
        text: `\n\nFile: ${file}\n\n${fileContent}`,
      });

      console.log(`Added ${file} to analysis queue`);
    }

    console.log("Sending files to Google Generative AI for structured analysis...");

    // Simplified schema
    const simplerSchema = {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Overall summary of all the code files"
        },
        fileAnalyses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              fileName: { type: "string" },
              purpose: { type: "string" },
              detailedExplanation: { type: "string" },
            },
            required: ["fileName", "purpose", "detailedExplanation"],
          }
        }
      },
      required: ["summary", "fileAnalyses"]
    };

    // Send the request to the AI model
    const result = await generateObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "user",
          content: content,
        }
      ],
      schema: simplerSchema,
    });

    console.log("\n--- CODE ANALYSIS RESULTS ---\n");

    // Display the summary
    console.log("SUMMARY:");
    console.log(result.summary);
    console.log("\n--- INDIVIDUAL FILE ANALYSES ---\n");

    // Display each file analysis
    result.fileAnalyses.forEach((analysis, index) => {
      console.log(`\n[FILE ${index + 1}]: ${analysis.fileName}`);
      console.log(`Purpose: ${analysis.purpose}`);
      console.log("\nDetailed Explanation:");
      console.log(analysis.detailedExplanation);
    });

    // Save the structured analysis to a JSON file
    fs.writeFileSync("code-analysis-results.json", JSON.stringify(result, null, 2));
    console.log("\nStructured analysis saved to code-analysis-results.json");

  } catch (error) {
    console.error("Error analyzing code files:", error);
  }
}

// Run the function
analyzeCodeFiles().catch(console.error);
