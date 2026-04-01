import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, AIMessage, SystemMessage } from "langchain";
import { tool, createAgent } from "langchain";
import { searchInternet } from "./internet.service.js";
import * as z from "zod";



const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  apiKey: process.env.GOOGLE_GEMINI_KEY,
  streaming: true
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});




const searchInternetTool = tool(
    searchInternet, {

  name: "searchInternet",
  description: "this tool is used to search latest information from internet",
  schema: z.object({
    query: z.string().describe("the search query to look up on the internet"),
  }),
})




const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
})


export async function generateResponse(messages) {
    return agent.stream(
      
      {
        messages : messages.map((msg) =>{
          if(msg.role === 'user') return new HumanMessage(msg.content)
          if(msg.role === 'ai') return new AIMessage(msg.content)
        })
    },
    { streamMode : "messages"}

    )
}




export async function generateTitle(message) {
  const title = await mistralModel.invoke([
    new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),

    new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
        `),
  ]);

  return title.content;
}
