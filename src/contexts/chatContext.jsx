import React from 'react';

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext(undefined)

const STORAGE_KEY = 'all_chats';
const CURRENT_CHAT_KEY = 'current_chat';
const CURRENT_CHAT_MODE_KEY = 'current_chat_mode';
const default_id = Date.now().toString();


function loadChatsFromStorage() {
    const storedChats = localStorage.getItem(STORAGE_KEY);

    if (storedChats) {
        try {
            const chats = JSON.parse(storedChats);
            return chats.map((chat) => ({
                ...chat,
                messages: chat?.messages?.map((msg) => ({
                    ...msg,
                })) || [],
            }));
        } catch (e) {
            console.error("Error parsing stored chats:", e);
        }
    }

    const defaultChat = [{
        id: default_id,
        title: 'New chat',
        messages: [],
    }];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultChat));
    return defaultChat;
}


function loadCurrentChatFromStorage() {
    const currentChatId = localStorage.getItem(CURRENT_CHAT_KEY);
    if (currentChatId) {
        return currentChatId;
    } else {
        localStorage.setItem(CURRENT_CHAT_KEY, default_id);
        return default_id;
    }
}

function loadCurrentModeFromStorage() {
    const chatModes = localStorage.getItem(CURRENT_CHAT_MODE_KEY);
    const currentId = loadCurrentChatFromStorage();
    if (chatModes) {
        try {
            const parsed = JSON.parse(chatModes);

            if (Array.isArray(parsed)) {
                const match = parsed.find((chat) => chat.id === currentId);
                return match?.mode;
            }
        } catch (e) {
            console.error("Error parsing CURRENT_CHAT_MODE:", e);
        }
    }
    const default_mode = {
        id: default_id,
        mode: 0
    }
    localStorage.setItem(CURRENT_CHAT_MODE_KEY, JSON.stringify([default_mode]));
    return 0;
}


const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState(loadChatsFromStorage);
    const [currentChatId, setCurrentChatId] = useState(loadCurrentChatFromStorage);
    const [mode, setMode] = useState(loadCurrentModeFromStorage);
    const [isTyping, setIsTyping] = useState(false);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    }, [chats]);

    useEffect(() => {
        localStorage.setItem(CURRENT_CHAT_KEY, currentChatId);
    }, [currentChatId]);


    useEffect(() => {
        const handleModeChange = () => {
            const newMode = loadCurrentModeFromStorage();
            setMode(newMode);
        };

        window.addEventListener('modeChanged', handleModeChange);
        return () => {
            window.removeEventListener('modeChanged', handleModeChange);
        };
    }, [currentChatId, chats]);


    const createNewChat = () => {
        const newChat = {
            id: Date.now().toString(),
            title: 'New chat',
            messages: [],
        };
        setChats((prev) => [...prev, newChat]);
        setCurrentChatId(newChat.id);

    };

    const deleteChat = (chatId) => {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChatId === chatId) {
            const remainingChats = chats.filter((chat) => chat.id !== chatId);
            if (remainingChats.length > 0) {
                setCurrentChatId(remainingChats[0].id);

            } else {
                createNewChat();
            }

        }
    };

    const sendMessage = async (content) => {
        const userMessage = {
            id: Date.now().toString(),
            content,
            isUser: true,
        };

        setChats((prev) =>
            prev.map((chat) => {
                if (chat.id === currentChatId) {
                    return {
                        ...chat,
                        messages: [...chat.messages, userMessage],
                    };
                }
                return chat;
            })
        );

        try {
            setIsTyping(true);
            let response;
            console.log(mode);
            if (mode == 0) {
                response = await axios.post(`https://ai-implementation.lockated.com/process_prompt/?token=${token}`, {
                    user_prompt: content,
                });
            } else {
                response = await axios.post(`https://ai-implementation.lockated.com/process_prompt/?token=${token}`, {
                    user_input: content,
                });
            }


            const aiMessage = {
                id: (Date.now() + 1).toString(),
                content: response.data,
                isUser: false,
            };

            console.log(aiMessage);

            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === currentChatId
                        ? { ...chat, messages: [...chat.messages, aiMessage] }
                        : chat
                )
            );
            setIsTyping(false);
        } catch (error) {
            console.error("Error fetching the response:", error);
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === currentChatId
                        ? {
                            ...chat, messages: [...chat.messages, {
                                id: (Date.now() + 1).toString(),
                                content: "Sorry, I couldn't get a response right now.",
                                isUser: false,
                            }]
                        }
                        : chat
                )
            );
        } finally {
            setIsTyping(false);
        }
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                currentChatId,
                isTyping,
                createNewChat,
                deleteChat,
                sendMessage,
                setCurrentChatId,
                mode
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export default ChatProvider

export function useChatContext() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}