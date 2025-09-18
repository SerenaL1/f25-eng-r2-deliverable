/* eslint-disable */
import OpenAI from "openai";
// TODO: Import whatever service you decide to use. i.e. `import OpenAI from 'openai';`

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a species and animal expert chatbot. You specialize in providing information about animals, including their habitat, diet, conservation status, behavior, and other biological facts.

You should ONLY respond to questions about animals, species, wildlife, marine life, insects, birds, mammals, reptiles, amphibians, and related biological topics.

If someone asks about anything unrelated to animals or species (like cooking, technology, politics, etc.), politely remind them that you only handle species-related queries and ask them to ask about animals instead.

Keep your responses informative but conversational, and always be helpful and engaging when discussing animal topics.`;

// HINT: You'll want to initialize your service outside of the function definition

// TODO: Implement the function below
export async function generateResponse(message: string): Promise<string> {
  try {
    // Call OpenAI API with the system prompt and user message
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can change to "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 500, // Limit response length
      temperature: 0.7, // Slightly creative but focused responses
    });

    // Extract the response content
    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    return response;
  } catch (error) {
    console.error("Error calling OpenAI:", error);

    // Return a safe fallback message instead of crashing
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try asking about an animal or species again in a moment!";
  }
}
