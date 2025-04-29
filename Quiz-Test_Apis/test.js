import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error('API Key not found in the environment variables.');
    return;
  }

  const folderPath = './pdf-inputs'; // Change to your folder name

  try {
    console.log('Started Reading Folder...');

    // Read all files in the folder
    const files = fs.readdirSync(folderPath);

    // Filter only code files (.js, .py, .jsx, etc.)
    const codeFiles = files.filter(file =>
      file.endsWith('.js') || file.endsWith('.py') || file.endsWith('.jsx') || file.endsWith('.ts')
    );

    if (codeFiles.length === 0) {
      console.log('No valid code files found in the folder.');
      return;
    }

    let messages = [{ type: 'text', text: 'Explain the following code files in detail:' }];

    // Read each file and add its content to messages
    for (const file of codeFiles) {
      const filePath = path.join(folderPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      messages.push({ type: 'text', text: `### File: ${file}\n${content}` });
    }

    // Convert messages array into string
    messages = JSON.stringify(messages);

    console.log('Started Generating Response...');

    const { object } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      schema: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()),
            answer: z.string(),
          })
        ).min(10),
      }),
      prompt: `
        Generate at least 10 questions related to the following code files. Each question should pertain to a specific function or line of code and describe its purpose within the program.
        ${messages}
        1).In First Ask The Question
        2).Next Generate 5 Options minimum
        3). Give The Correct answer From the Options for this Question
        
      `,
    });

    console.log(JSON.stringify(object, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
