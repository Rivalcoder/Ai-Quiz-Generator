# PDF Inputs

This script demonstrates how to generate text using the Google Generative AI API with specific instructions to describe the content of a PDF file.

## Prerequisites

- Node.js and npm (or yarn) installed
- A Google Cloud Platform project with the Generative AI API enabled
- A service account with the necessary permissions
- A `.env.local` file containing your API key:
    GOOGLE_GENERATIVE_AI_API_KEY=<YOUR_API_KEY>


## Installation

1. **Install dependencies:**

  ```bash
  npm install @ai-sdk/google ai dotenv fs
  ```

## Usage

1. **Run the Script:**

  ```bash
  node pdf-inputs.js
  ```

2. **View the Response:**

  The generated response will be displayed on the terminal.

## Script Details

- **System Instruction:** The AI is instructed to describe the content of a PDF file in detail.
- **Prompt:** The script sends a prompt to the AI to describe the content of a PDF file.
- **Error Handling:** The script includes error handling to catch and log any errors during the text generation process.


