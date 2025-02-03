import { Bot, User } from 'lucide-react'
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
        </div>
    )
}

export default ChatMessage