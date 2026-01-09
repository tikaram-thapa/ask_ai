import express from "express";
import type { Request, Response } from 'express';
import { chatController } from "./controllers/chat.controller";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

// Create a router instance
const router = express.Router();

// Define routes and associate them with controller methods
// router.get("/", (req: Request, res: Response) => {
//   res.send("Server is running!");
// });
// router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a greeting message
 *     message: Hello, Ask anything with AI
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello, Ask anything with AI" });
});

/**
 * @swagger
 * /api/chat:
 *  post:
 *    summary: Ask anything to the chat service
 *    requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - prompt
 *             - conversationId
 *           properties:
 *             prompt:
 *               type: string
 *             conversationId:
 *               type: string
 *    responses:
 *      200:
 *        description: Success
 */
router.post('/api/chat', chatController.sendMessage);

/**
 * @swagger
 * /api/conversations:
 *  get:
 *    summary: Get all conversations
 *    responses:
 *     200:
 *      description: Success
 */
router.get('/api/conversations', chatController.getConversations);

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
