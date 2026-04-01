import { initializationSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
  editChatTitle,
} from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
  delete_Chat,
  updateChatTitle,
  appendToLastMessage,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch()



  const typeWriterEffect = async (chatId, text) => {
    for (const char of text) {
      dispatch(appendToLastMessage({ chatId, content: char }));
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  

  const handleSendMessage = async ({ message, chatId }) => {
    
    dispatch(setLoading(true));

    if (chatId) {
      dispatch(addNewMessage({ 
        chatId, 
        content: message, 
        role: "user" }));
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, chatId }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let currentChatId = chatId;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split("\n");
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = JSON.parse(line.slice(6));

        if (data.type === "metadata") {
          if (!chatId) {
            dispatch(createNewChat({ chatId: data.chatId, title: data.title }));
            dispatch(
              addNewMessage({
                chatId: data.chatId,
                content: message,
                role: "user",
              }),
            );
          }
          currentChatId = data.chatId;
          dispatch(setCurrentChatId(data.chatId));
        }

        if (data.type === "done") {
          dispatch(setLoading(false));
        } 
        else if (data.text) {
            await typeWriterEffect(currentChatId, data.text)

        }
      }
    }

  }







  // get all chats
  const handleGetChats = async () => {
    dispatch(setLoading(true));
    const data = await getChats();
    const { chats } = data;

    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };

          return acc;
        }, {}),
      ),
    );

    dispatch(setLoading(false));
  };

  async function handleOpenChat(chatId, chats) {
    if (chats[chatId]?.messages.length === 0) {
      const data = await getMessages({ chatId });
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
    }

    dispatch(setCurrentChatId(chatId));
  }

  const handleDeleteChat = async (chatId) => {
    const data = await deleteChat({ chatId });
    // console.log(data.message);
    dispatch(delete_Chat(chatId));
  };

  const handleEditTitle = async (chatId, newTitle) => {
    const data = await editChatTitle({ chatId, newTitle });
    
    dispatch(updateChatTitle({ chatId, newTitle }));
    // console.log(data.message);
  };

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
  };




  return {
    initializationSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleEditTitle,
    handleNewChat,
  };
};
