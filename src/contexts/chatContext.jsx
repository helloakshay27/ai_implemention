import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChatContext = createContext(undefined);

const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [mode, setMode] = useState(""); // "CHATS" or "BRD"
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();

    const fetchChatList = async () => {
        try {
            const response = await axios.get(`https://ai-implementation.lockated.com/list_conversations/?token=${token}`);
            if (response.data) {
                setChats(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchChatList();
    }, []);

    const createNewChat = async () => {
        try {
            const response = await axios.post(`https://ai-implementation.lockated.com/conversations/?token=${token}`);
            const tokenId = response.data?.conversation_token;

            if (tokenId) {
                setCurrentChatId(tokenId);
                navigate(`/ai-lockated/${tokenId}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchConversations = async (id) => {
        try {
            const response = await axios.get(`https://ai-implementation.lockated.com/get_conversation_details/?conversation_token=${id}&token=${token}`);
            const fetchedMessages = response.data?.messages ? response.data.messages : [];
            setMessages(fetchedMessages);
        } catch (error) {
            console.log(error);
            setMessages([]); // fallback to empty array on error
        }
    };

    const sendMessage = async (content, compitator = [], video = [], currentChatId) => {
        if (!currentChatId) return;

        const userQuery = {
            id: Date.now(),
            user_prompt: content,
            timestamp: new Date().toISOString(),
        };

        const userMessage = {
            message_id: userQuery.id,
            query: userQuery,
            response: null, // initially no response yet
        };

        setMessages((prev) => [...prev, userMessage]); // Just push into the array, no mapping by id

        try {
            setIsTyping(true);

            const requestData = mode === 'CHATS'
                ? {
                    user_prompt: content,
                    conversation_token: currentChatId
                }
                : {
                    user_input: content,
                    conversation_token: currentChatId
                };

            compitator.forEach((comp, index) => {
                requestData[`competitor_${index + 1}`] = comp.website || comp.name || "";
            });

            video.forEach((video, index) => {
                requestData[`video_link_${index + 1}`] = video.videoLink || "";
                requestData[`purpose_${index + 1}`] = video.feature || "";
            });

            const response = await axios.post(
                `https://ai-implementation.lockated.com/process_prompt/?token=${token}`,
                requestData
            );

            const aiResponse = {
                id: Date.now() + 1,
                ...response.data,
                timestamp: new Date().toISOString(),
            };

            setChats(prevChats => {
                const exists = prevChats.some(chat => chat.conversation_token === currentChatId);
                if (!exists) {
                    return [...prevChats, { conversation_token: currentChatId }];
                }
                return prevChats;
            });

            setMessages((prev) => {
                const updatedMessages = [...prev];
                const index = updatedMessages.findIndex(msg => msg.message_id === userQuery.id);

                if (index !== -1) {
                    updatedMessages[index] = {
                        ...updatedMessages[index],
                        response: aiResponse
                    };
                }

                return updatedMessages;
            });

        } catch (error) {
            console.error("Error fetching the response:", error);

            const aiResponse = {
                id: Date.now() + 1,
                response: "Sorry, I couldn't get a response right now.",
                timestamp: new Date().toISOString(),
            };

            setMessages((prev) => {
                const updatedMessages = [...prev];
                const index = updatedMessages.findIndex(msg => msg.message_id === userQuery.id);

                if (index !== -1) {
                    updatedMessages[index] = {
                        ...updatedMessages[index],
                        response: aiResponse
                    };
                }

                return updatedMessages;
            });
        } finally {
            setIsTyping(false);
        }
    };

    console.log(messages)

    const deleteChat = async (chatId) => {
        try {
            await axios.delete(`https://ai-implementation.lockated.com/delete_conversation/?conversation_token=${chatId}&token=${token}`)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                currentChatId,
                messages,
                isTyping,
                createNewChat,
                deleteChat,
                sendMessage,
                setCurrentChatId,
                mode,
                setMode,
                fetchConversations
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;

export function useChatContext() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}
