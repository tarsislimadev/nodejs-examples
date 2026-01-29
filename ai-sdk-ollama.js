// https://github.com/jagreehal/ai-sdk-ollama

// npm install ai-sdk-ollama ai@^6.0.0

// ollama pull llama3.2:1b

import { ollama } from 'ai-sdk-ollama';
import { generateText } from 'ai';

// Works in both Node.js and browsers
const { text } = await generateText({
  model: ollama('llama3.2:1b'),
  prompt: 'Write a music in Spanish',
  temperature: 0.8,
});

console.log(text);
