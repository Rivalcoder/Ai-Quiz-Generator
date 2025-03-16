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

    // Prepare messages for AI
    let messages = [{ type: 'text', text: 'Analyze the following code files:' }];

    // Process each uploaded file
    for (const file of Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]) {
      const fileName = file.originalFilename || path.basename(file.filepath);
      const filePath = file.filepath;
      
      // Read file content
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Add file content to messages
      messages.push({ type: 'text', text: `### File: ${fileName}\n${content}` });
    }

    // Generate quiz title and questions
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      schema: z.object({
        quizTitle: z.string(),
        questions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()),
            answer: z.string(),
          })
        ).min(10),
      }),
      prompt: `
        Based on the following code files, generate:
        1) A descriptive quiz title that reflects the main technologies or concepts in these files
        2) At least 10 quiz questions that test understanding of the code's functionality, structure, and concepts
        
        For each question:
        - Ask about specific functions, concepts, or patterns in the code if ask About the Function Give Function Code Below 
        And Dont Questions like what this file do like That Ask Functions and code Lines
        - Provide More Than 5 options for each question
        - Include one correct answer
        - Ensure questions cover different aspects of the code
        
        ${messages.map(m => m.text).join('\n\n')}
      `,
    });

    // Clean up temporary files
    for (const file of Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles]) {
      fs.unlinkSync(file.filepath);
    }

    res.status(200).json(object);
  } catch (error) {
    console.error('Error analyzing files:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}