import React, { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../contexts/chatContext';
import ChatMessage from './ChatMessage';
import { Bot } from 'lucide-react';
import InputBox from './InputBox';
import PromptModal from './PromptModal';
import { useParams } from 'react-router-dom';

const ChatArea = () => {
    const { id } = useParams()
    const { chats, isTyping, mode, messages } = useChatContext();
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

    return (
        <div className='chat-area'>
            {
                messages && messages.map((message) => {
                    return (
                        <ChatMessage key={message.id} message={message} />
                    )
                })
            }

            {
                isTyping && (
                    <div className='d-flex'>
                        <Bot className="me-2 mt-3 " style={{ color: 'grey' }} size={24} />

                        <div className=" bot-thinking">
                            {/* <img src='/typing.svg' alt="Thinking..." style={{ width: '3rem',color: 'grey' }} /> */}
                        </div>
                    </div>
                )
            }

            {
                isModalOpen && <PromptModal setIsModalOpen={setIsModalOpen} />
            }

            <div ref={messagesEndRef} />
        </div>
    )
}

export default ChatArea