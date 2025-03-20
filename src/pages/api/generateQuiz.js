// pages/api/analyzeCodeFiles.js
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Parse the form data with formidable
    const form = new IncomingForm({
      multiples: true,
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get the uploaded files
    const uploadedFiles = files.files;
    if (!uploadedFiles || (Array.isArray(uploadedFiles) && uploadedFiles.length === 0)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Convert uploaded files into an array
    const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

    // Function to read file contents
    const readFileContent = (file) => {
      const fileName = file.originalFilename || path.basename(file.filepath);
      const content = fs.readFileSync(file.filepath, 'utf-8');
      return { fileName, content };
    };

    // Read all files and store their content
    const filesData = fileArray.map(readFileContent);

    // Split files into batches of 4-5
    const batchSize = 5;
    const fileBatches = [];
    for (let i = 0; i < filesData.length; i += batchSize) {
      fileBatches.push(filesData.slice(i, i + batchSize));
    }

    // Function to generate questions for a batch of files
    const generateBatchQuestions = async (batch) => {
      const messages = [{ type: 'text', text: 'Analyze the following code files:' }];
      batch.forEach(({ fileName, content }) => {
        messages.push({ type: 'text', text: `### File: ${fileName}\n${content}` });
      });

      // Generate quiz for this batch
      const { object } = await generateObject({
        model: google('gemini-1.5-flash'),
        schema: z.object({
          quizTitle: z.string(),
          questions: z.array(
            z.object({
              codeSnippet: z.string(),
              question: z.string(),
              options: z.array(z.string()).min(5),
              answer: z.string(),
              explanation: z.string().optional(),
            })
          ).max(5),
        }),
        prompt: `
        You are an expert software engineer and educator. You are provided with all the files from a user’s project. Your task is to read through every file and analyze the project’s purpose, structure, implementation details, and any notable design decisions. Based on your analysis, generate a quiz to test the user’s understanding of the project. 

          1) A descriptive quiz title reflecting the main technologies, design patterns, or key concepts in these files.
          2) Generate exactly 5 quiz questions testing deep understanding of the code’s logic, functionality, and design decisions.
          3) Each question must include a code snippet, a detailed question, 5 plausible answer options, a correct answer, and an optional explanation(Must Be In Formated Order not like combined para with /n).
          4).Direct Answer Should Not Be in the Code Snippet or Question directly.
            Example : Like this Dont ask ( What is the background color of the body element in the CSS file?
                                  background-color: #f5f7fa;)
          5).Dont Ask Questions Like what is the Use of This File Like That and Dont Define the question with File name
          6).Generate Very Hard Questions like What is the Use Of the Function like This Models
          ${messages.map(m => m.text).join('\n\n')}
        `,
      });

      return object.questions; // Return only questions
    };

    // Process batches in parallel
    const batchPromises = fileBatches.map(generateBatchQuestions);
    const batchResults = await Promise.all(batchPromises);

    // Flatten results and ensure exactly 40 questions
    const allQuestions = batchResults.flat().slice(0, 40);

    // Combine into final object
    const finalObject = {
      quizTitle: "Comprehensive Code Analysis Quiz",
      questions: allQuestions,
    };

    // Clean up temporary files
    fileArray.forEach(file => fs.unlinkSync(file.filepath));

    res.status(200).json(finalObject);
  } catch (error) {
    console.error('Error analyzing files:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
