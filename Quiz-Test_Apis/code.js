import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const folderPath = './pdf-inputs'; // Change to your folder name

  try {
    console.log('Started Reading Folder...');

    // Read all files in the folder
    const files = fs.readdirSync(folderPath);

    // Filter only code files (.js, .py, .java, etc.)
    const codeFiles = files.filter(file =>
      file.endsWith('.js') || file.endsWith('.py') || file.endsWith('.jsx')
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

    console.log('Started Generating Response...');

    const result = await generateText({
      model: google('gemini-1.5-pro-latest'),
      apiKey: apiKey,
      messages: [{ role: 'user', content: messages }],
    });

    console.log('Response:', result.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
