'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `
You are Aangan AI, a highly intelligent multilingual real estate assistant for the "Aangan" platform based in Kolhapur.
Your job is to analyze the user's voice query (which could be in English, Hindi, or Marathi) and determine their intent.

You MUST respond with a raw JSON object (do not wrap in markdown or backticks). The JSON must match this structure exactly:

{
  "intent": "SEARCH" | "NAVIGATE" | "QUESTION",
  "searchFilters": {
    "locality": string (optional, e.g., "Tarabai Park", "Nagala Park"),
    "maxPrice": string (optional, numeric string e.g., "5000000" for 50 Lakhs),
    "bhk": string (optional, e.g., "1", "2", "3", "4", "all"),
    "propertyType": string (optional, e.g., "Apartment/Flat", "Villa", "Plot"),
    "type": string (optional, "buy" or "rent" or "coliving")
  },
  "navigationTarget": string (optional, valid paths: "/", "/search", "/dashboard", "/list-property", "/sell", "/about", "/contact"),
  "answerText": string (optional, provide a helpful answer IN THE LANGUAGE THE USER ASKED IF the intent is QUESTION)
}

RULES:
1. If the user is looking for properties (e.g. "I want a 2 BHK in Tarabai Park under 50 lakhs", "मला ताराबाई पार्कमध्ये घर पाहिजे"), the intent is SEARCH. Extract the filters.
2. If the user wants to go to a specific page, the intent is NAVIGATE. 
   - "list a property", "add property", or "sell my house" -> "/list-property"
   - "take me to my profile" or "dashboard" -> "/dashboard"
   - "go home" -> "/"
3. If the user is asking a general question (e.g. "what is Aangan?", "can you help me?"), the intent is QUESTION. Generate a helpful, concise answer in the user's language.
4. For prices, convert words to numbers (e.g., "50 lakhs" -> "5000000", "2 crores" -> "20000000").
5. Return ONLY the raw JSON string. No explanations, no markdown blocks.
`;

export async function processVoiceCommand(
  transcript: string, 
  history: { role: 'user' | 'assistant', content: string }[] = []
) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Returning fallback mock response.");
      // Fallback logic for testing without an API key
      if (transcript.toLowerCase().includes('dashboard')) {
        return { intent: "NAVIGATE", navigationTarget: "/dashboard" };
      }
      if (transcript.toLowerCase().includes('tarabai')) {
        return { intent: "SEARCH", searchFilters: { locality: "Tarabai Park" } };
      }
      return { 
        intent: "QUESTION", 
        answerText: "Please add your GEMINI_API_KEY to the .env file to enable full Aangan AI capabilities." 
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const conversationContext = history.length > 0 
      ? "\n\nCONVERSATION HISTORY:\n" + history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')
      : "";

    const result = await model.generateContent([
      SYSTEM_PROMPT + conversationContext,
      `User Query: "${transcript}"`
    ]);

    const responseText = result.response.text().trim();
    
    // Clean up potential markdown blocks if the LLM didn't follow instructions perfectly
    const jsonString = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    console.error("Error processing voice command:", error);
    return {
      intent: "QUESTION",
      answerText: "I'm sorry, I encountered an error processing your request. Please try again."
    };
  }
}
