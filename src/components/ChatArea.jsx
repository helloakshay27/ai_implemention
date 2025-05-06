import React, { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../contexts/chatContext';
import ChatMessage from './ChatMessage';
import PromptModal from './PromptModal';
import BRDTable from './BRDTable';

const ChatArea = () => {
    const { isTyping, mode, messages } = useChatContext();
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (mode === 'BRD') {
            setIsModalOpen(true)
        }
    }, [])

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    console.log(messages);
    return (
        <div className='chat-area'>
                {messages && messages.map((message) => {
                    return (
                        
                        <ChatMessage key={message.id} message={message} />
                    );
                })
            }
      
            {
                isModalOpen && <PromptModal setIsModalOpen={setIsModalOpen} />
            }

            <div ref={messagesEndRef} />
        </div>
    )
}

export default ChatArea