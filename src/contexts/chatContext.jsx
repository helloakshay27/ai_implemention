import axios from "axios";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext(undefined);

const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [mode, setMode] = useState(""); // "CHATS" or "BRD"
    const [storedId, setStoredId] = useState(null);
    const [BRDFormData, setBRDFormData] = useState({});
    const [logs, setLogs] = useState("")

    console.log("logs", logs)

    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();

    useEffect(() => {
        const idFromStorage = localStorage.getItem("conversation_token");
        setStoredId(idFromStorage);
        console.log("Stored ID:", idFromStorage);
    }, [storedId]);

    useEffect(() => {
        console.log("Current Chat ID:", messages);
    }, [messages]);

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
            localStorage.setItem("conversation_token", tokenId);
            setStoredId(tokenId);
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
            setLogs(response.data?.messages?.logs || ""); // Set logs if available
        } catch (error) {
            console.log(error);
            setMessages([]); // fallback to empty array on error
        }
    };

    const sendMessage = async (content, compitator = [], video = [], currentChatId) => {
        if (!currentChatId) return;

        const userQuery = {
            id: Date.now(), // Unique ID
            user_prompt: content,
            timestamp: new Date().toISOString(),
        };

        console.log(userQuery)

        const userMessage = {
            message_id: userQuery.id,
            query: userQuery,
            response: <>{isTyping && <div className="bot-thinking">{logs}</div>}</>, // No response yet
        };

        // Immediately show user message
        setMessages((prev) => [...prev, userMessage]);

        try {
            setIsTyping(true);

            const requestData = mode === 'CHATS'
                ? {
                    user_prompt: content,
                    conversation_token: currentChatId,
                    prompt_id: userQuery.id,
                }
                : {
                    user_input: content,
                    conversation_token: currentChatId,
                    prompt_id: userQuery.id,
                };

            // Add competitors to the request data
            compitator.forEach((comp, index) => {
                requestData[`competitor_${index + 1}`] = comp.website || comp.name || "";
            });

            // Add video links and purposes to the request data
            video.forEach((video, index) => {
                requestData[`video_link_${index + 1}`] = video.videoLink || "";
                requestData[`purpose_${index + 1}`] = video.feature || "";
            });

            // Send message to server
            const response = await axios.post(
                `https://ai-implementation.lockated.com/process_prompt/?token=${token}`,
                requestData
            );
            if (response.data.warning) {
                toast.error(response.data.warning);
            }
            fetchConversations(currentChatId);

            // Save chat if new
            setChats((prevChats) => {
                const exists = prevChats.some(chat => chat.conversation_token === currentChatId);
                if (!exists) {
                    return [...prevChats, { conversation_token: currentChatId }];
                }
                return prevChats;
            });

        } catch (error) {
            console.error("Error while sending message:", error);
            setIsTyping(false);
        } finally {
            setIsTyping(false);
        }
    };

    const deleteChat = async (chatId) => {
        try {
            const response = await axios.delete(`https://ai-implementation.lockated.com/delete_conversation/?conversation_token=${chatId}&token=${token}`)
            console.log(response)
            if (response.data.success) {
                fetchChatList()
            }
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
                fetchConversations,
                BRDFormData,
                setBRDFormData,
                logs,
                setLogs
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
