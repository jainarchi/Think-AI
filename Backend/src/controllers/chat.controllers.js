import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import savePromptModel from "../models/savePrompt.js";
import { generateResponse, generateTitle } from "../services/ai.service.js";

/**
 * @route /api/chats/message
 * @desc create new user & ai message
 * create new chat with title
 */

async function sendMessage(req, res) {
  const { message, chatId } = req.body;

  let title = null,
    chat = null;

  if (!chatId) {
    title = await generateTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const allMessages = await messageModel.find({ chat: chatId || chat._id });
  console.log(allMessages);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders && res.flushHeaders();

  let isClientDisconnected = false;

req.on("close", () => {
  console.log("Client disconnected");
  isClientDisconnected = true;
});

 // metadata event send to client
  res.write(
    `data: ${JSON.stringify({
      type: "metadata",
      chatId: chatId || chat._id,
      title,
    })}\n\n`,
  );

  // send chunk of data to client by res.write and collect data in fullResponse variable to save the ai response in a database

  try {
    const stream = await generateResponse(allMessages);
    let fullResponse = "";

    for await (const [chunk, metadata] of stream) {
        if (isClientDisconnected) break; 
      // console.log("metadata:", JSON.stringify(metadata));
      if (
        chunk.content &&
        typeof chunk.content === "string" &&
        metadata?.langgraph_node === "model_request"
      ) {
        fullResponse += chunk.content;
        res.write(`data: ${JSON.stringify({ text: chunk.content })}\n\n`);
      }
    }
   
    let aiMessage = null
   
    //avoid creating new ai message if client disconnected
    if(!isClientDisconnected && fullResponse){
       aiMessage = await messageModel.create({
          chat: chatId || chat._id,
          content: fullResponse,
          role: "ai",
        })
      }

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        chatId: chatId || chat._id,
        title,
        aiMessageId: aiMessage?._id,
      })}\n\n`,
    );
    res.end();





  } catch (error) {
    // console.log("err in generate response", error);
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message: error.message || "Something went wrong",
      })}\n\n`,
    );
    res.end();
  }
}












/**
 * @desc fetch all chat
 * @route /api/chats/
 */

async function getChats(req, res) {
  const chats = await chatModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    chats,
    message: "all chats fetched successfully",
  });
}

/**
 * @desc fetch all messages of the specific chat
 * @route /api/chats/:chatId/messages
 */

async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(400).json({
      message: "chat not found",
      success: false,
      err: "chat not found",
    });
  }

  const messages = await messageModel.find({ chat: chatId });

  res.status(200).json({
    message: "all messages fetch successfully",
    messages,
    success: true,
  });
}

/**
 * @desc delete chat and its associated messages
 * @route DELETE /api/chats/:chatId
 */

async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(400).json({
      message: "chat not found",
      success: false,
      err: "chat not found",
    });
  }

  await messageModel.deleteMany({ chat: chatId });

  console.log("delte chat");
  res.status(200).json({
    message: "chat deleted successfully ",
    success: true,
  });
}

/**
 * @route PATCH /api/chats/:chatId/edit-title
 * @desc edit chat title
 */

async function editChatTitle(req, res) {
  const { chatId } = req.params;
  const { newTitle } = req.body;

  const chat = await chatModel.findOneAndUpdate(
    {
      _id: chatId,
      user: req.user.id,
    },
    {
      title: newTitle,
    },
    {
      new: true,
    },
  );

  if (!chat) {
    return res.status(400).json({
      message: "chat not found",
      success: false,
      err: "chat not found",
    });
  }

  res.status(200).json({
    message: "chat title updated successfully",
    success: true,
    chat,
  });
}

async function savePrompt(req, res) {
  // add validation for this

  const { title, description } = req.body;
  const user = req.user.id;

  const savedPrompt = await savePromptModel.create({
    user,
    title,
    description,
  });

  res.status(201).json({
    message: "prompt saved successfully",
    success: true,
    savedPrompt,
  });
}

async function getSavedPrompt(req, res) {
  const savedPrompts = await savePromptModel.find({
    user: req.user.id,
  });

  res.status(200).json({
    message: "all saved prompts fetched successfully",
    success: true,
    savedPrompts,
  });
}

export async function deletePrompt(req, res) {
  const { promptId } = req.params;

  console.log(promptId, req.user.id);

  const deletedPrompt = await savePromptModel.findOneAndDelete({
    _id: promptId,
    user: req.user.id,
  });

  if (!deletedPrompt) {
    return res.status(400).json({
      message: "prompt not found",
      success: false,
      err: "prompt not found",
    });
  }

  res.status(200).json({
    message: "prompt deleted successfully",
    success: true,
  });
}

export {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
  editChatTitle,
  savePrompt,
  getSavedPrompt,
};
