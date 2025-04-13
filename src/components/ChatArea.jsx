import React, { useEffect, useRef } from 'react'
import { useChatContext } from '../contexts/chatContext';
import ChatMessage from './ChatMessage';
import { Bot } from 'lucide-react';

const ChatArea = () => {
    const { chats, currentChatId, isTyping } = useChatContext();
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    return (
        <div className='chat-area'>
            {
                currentChat?.messages?.map((message) => {
                    return (
                        <ChatMessage key={message.id} message={message} />
                    )
                })
            }

            {
                isTyping && (
                    <div className='d-flex'>
                        <Bot className="me-2 mt-3 text-primary" size={24} />
                        <div className="d-flex justify-content-start">
                            <img src='/typing.svg' alt="Thinking..." style={{ width: '3rem' }} />
                        </div>
                    </div>
                )
            }

            <div ref={messagesEndRef} />
        </div>
    )
}

export default ChatArea