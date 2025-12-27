import { OpenAI } from "openai";
import { conversationRepository } from "../repositories/conversation.repository"; ;

// console.log("CHAT.SERVICE.TS IS RUNNING: ");
// Implementation details for chat service
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// to prevent leaky abstraction
type ChatResponse = {
    id: string;
    message: string;
}

// public interface of chat service
export const chatService = {
    async sendMessage(prompt: string, conversationId: string): Promise<ChatResponse> {
        // Implementation for sending message to OpenAI and managing conversation state
        const response = await client.responses.create({
            model: "gpt-4o-mini", // gpt-5-nano
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 100,
            previous_response_id: conversationRepository.getLastResponseId(conversationId)
        });
        // console.log("responseId: ", response);
        conversationRepository.setLastResponseId(conversationId, response.id);
        return {
            id: response.id,
            message: response.output_text
        };
    }
}