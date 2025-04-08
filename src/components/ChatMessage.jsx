import { Bot, Copy, Download, Pin, Share2, User, Volume2 } from 'lucide-react'
import React from 'react'
import Markdown from 'react-markdown'

const ChatMessage = ({ message }) => {
    return (
        <div>
            <div
                key={message.id}
                className={`d-flex ${message.isUser
                    ? "justify-content-end"
                    : "justify-content-start"
                    }`}
            >
                {!message.isUser && (
                    <Bot className="me-2 mt-3 text-white" size={24} />
                )}
                <div
                    className={`message px-3 py-2 ${message.isUser ? "user-message" : "bot-message"
                        }`}
                >
                    {!message.isUser ? (
                        <Markdown>{message.content}</Markdown>
                    ) : (
                        message.content
                    )}
                </div>
                {message.isUser && (
                    <User className="ms-2 mt-3 text-primary" size={24} />
                )}
            </div>
            {
                !message.isUser && (
                    <div className='d-flex align-items-center gap-3 ms-5 action-btn'>
                        <Copy size={15} color='#fafafa' className='cursor-pointer' />
                        <Volume2 size={15} color='#fafafa' className='cursor-pointer' />
                        <Download size={15} color='#fafafa' className='cursor-pointer' />
                        <Share2 size={15} color='#fafafa' className='cursor-pointer' />
                        <Pin size={15} color='#fafafa' className='cursor-pointer' />
                    </div>
                )
            }
        </div>
    )
}

export default ChatMessage