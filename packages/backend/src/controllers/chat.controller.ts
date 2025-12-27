import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";

// Implementation details for chat controller
// zod validation can be added here for request body
// const chatSchema = ({
//   prompt: z.string().min(1, "Prompt is required").max(100, "Prompt is too long"),
//   conversationId: z.string().uuid("Invalid conversation ID")
// });

// public interface of chat controller
export const chatController = {
    async sendMessage (req: Request, res: Response) {
        // Implementation for sending message to OpenAI and managing conversation state
        const { prompt, conversationId } = req.body;
        if (prompt.trim().length < 1) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        if (conversationId.trim().length < 1) {
            return res.status(400).json({ error: "Conversation ID is required" });
        }
        try {
            const response = await chatService.sendMessage(prompt, conversationId);
        res.json({ message: response.message});
        } catch (error) {
            res.status(500).json({ error: "An error occurred while processing your request." });
        }
    }
}