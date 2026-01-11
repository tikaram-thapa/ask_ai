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

// in-memory store for conversations
// const conversationsList = new Map<string, string>();

// in-memory store for user-specific conversation memory
const userMemory = new Map<string, Map<string, string>>();

// public interface of chat service
export const chatService = {
    async sendMessage(userId: string,prompt: string, conversationId: string): Promise<ChatResponse> {
        // Implementation for sending message to OpenAI and managing conversation state
        // console.log("User ID:", userId);
        // console.log("user last id: ", conversationRepository.getLastResponseId(userId));
        const response = await client.responses.create({
            model: "gpt-4o-mini", // gpt-5-nano
            input: prompt,
            temperature: 0.2,
            max_output_tokens: 100,
            previous_response_id: conversationRepository.getLastResponseId(userId)
        });
        // Store conversation state
        // conversationsList.set(`${response.id}_prompt`, prompt);
        // conversationsList.set(`${response.id}_response`, response.output_text);
        conversationRepository.setLastResponseId(userId, response.id);

        // Store user-specific conversation memory
        if (!userMemory.has(userId)) {
            userMemory.set(userId, new Map());
        }
        const userConversations = userMemory.get(userId)!;
        userConversations.set(`${response.id}_prompt`, prompt);
        userConversations.set(`${response.id}_response`, response.output_text);

        return {
            id: response.id,
            message: response.output_text
        };
    },
    async getUserConversations(userId: string): Promise<{ id: string; message: string }[]> {
        // console.log("Getting conversations...", conversationsList);
        const userConversations = userMemory.get(userId);
        if (!userConversations) {
            return [];
        }
        return Array.from(userConversations, ([id, message]) => ({ id, message }) );
    },
    async getConversations(): Promise<{ id: string; message: string }[]> {
        // console.log("Getting all conversations...", conversationsList);
        const allConversations: { userId: string, id: string; message: string }[] = [];
        userMemory.forEach((userConversations, userId) => {
            userConversations.forEach((message, id) => {
                allConversations.push({ userId, id, message });
            });
        });
        return allConversations;
    }
}
