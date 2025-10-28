import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import { publicChatAPI } from '../services/PublicChatAPI';

const PublicChatArea = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const chatType = searchParams.get('type') || 'general';
    
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        // Load messages from localStorage for this chat
        const savedMessages = localStorage.getItem(`public_messages_${id}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, [id]);

    const saveMessages = (newMessages) => {
        localStorage.setItem(`public_messages_${id}`, JSON.stringify(newMessages));
    };

    // Clear conversation (like PHP clear button)
    const clearConversation = () => {
        if (window.confirm('Are you sure you want to clear the conversation history?')) {
            setMessages([]);
            localStorage.removeItem(`public_messages_${id}`);
            publicChatAPI.clearConversation(id);
        }
    };

    const sendMessage = async (content, files = []) => {
        if (!content.trim() && files.length === 0) return;

        const userMessage = {
            message_id: Date.now(),
            query: {
                id: Date.now(),
                user_prompt: content,
                timestamp: new Date().toISOString(),
                type: chatType,
                files: files
            },
            response: null,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);

        setIsTyping(true);

        try {
            // Use the OpenAI API service (similar to PHP implementation)
            const apiResponse = await publicChatAPI.sendMessage(content, chatType, files, id);
            
            const botMessage = {
                message_id: Date.now() + 1,
                query: null,
                response: apiResponse.error ? apiResponse.message : apiResponse.response.message,
            };

            const finalMessages = [...updatedMessages, botMessage];
            setMessages(finalMessages);
            saveMessages(finalMessages);
        } catch (error) {
            console.error('OpenAI API Error:', error);
            const errorMessage = {
                message_id: Date.now() + 1,
                query: null,
                response: "Sorry, I encountered an error with the AI service. Please try again.",
            };
            
            const finalMessages = [...updatedMessages, errorMessage];
            setMessages(finalMessages);
            saveMessages(finalMessages);
        } finally {
            setIsTyping(false);
        }
    };



    const getChatTitle = () => {
        switch (chatType) {
            case 'text': return 'Text Chat';
            case 'image': return 'Image Chat';
            case 'structured': return 'Structured Data Chat';
            case 'general': return 'General Chat';
            default: return 'Chat';
        }
    };

    return (
        <div className="chat-area h-100 d-flex flex-column">
            <div className="chat-header p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0" style={{ color: "#C72030" }}>
                        💬 AI Writing Assistant - {getChatTitle()}
                    </h5>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={clearConversation}
                        title="Clear Conversation"
                    >
                        Clear Conversation
                    </button>
                </div>
                <small className="text-muted">
                    What do you want help with? • Powered by OpenAI GPT-3.5 Turbo • No login required
                </small>
            </div>
            
            <div className="messages-container flex-grow-1 overflow-auto p-3">
                {messages.length === 0 && (
                    <div className="text-center text-muted mt-4">
                        <div className="welcome-section p-4" style={{ 
                            backgroundColor: "#f8f9fa", 
                            borderRadius: "8px",
                            border: "1px solid #dee2e6"
                        }}>
                            <h6 style={{ color: "#C72030" }}>✨ AI Writing Assistant Ready</h6>
                            <p className="mb-2">Get help with writing, analysis, and creative tasks.</p>
                            
                            <div className="example-prompts mt-3">
                                <small className="text-muted d-block mb-2"><strong>Try these examples:</strong></small>
                                <div className="d-flex flex-wrap justify-content-center gap-2">
                                    <button 
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => document.querySelector('textarea').value = "Write a professional email to a client"}
                                        style={{ fontSize: "12px" }}
                                    >
                                        "Write a professional email to a client"
                                    </button>
                                    <button 
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => document.querySelector('textarea').value = "Help me brainstorm marketing ideas"}
                                        style={{ fontSize: "12px" }}
                                    >
                                        "Help me brainstorm marketing ideas"
                                    </button>
                                    <button 
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => document.querySelector('textarea').value = "Explain quantum computing simply"}
                                        style={{ fontSize: "12px" }}
                                    >
                                        "Explain quantum computing simply"
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mt-3">
                                <small className="text-success">
                                    � Same OpenAI technology as your PHP implementation
                                </small>
                            </div>
                        </div>
                    </div>
                )}
                
                {messages.length > 0 && (
                    <div className="conversation-history mb-4">
                        <h6 style={{ color: "#C72030", borderBottom: "1px solid #dee2e6", paddingBottom: "8px" }}>
                            📝 Conversation History:
                        </h6>
                        {messages.map((message, index) => (
                            <div key={message.message_id || index} className="mb-3">
                                {message.query && (
                                    <div className="message-user p-3 mb-2" style={{
                                        backgroundColor: "#d6ebff",
                                        borderLeft: "5px solid #007bff",
                                        borderRadius: "5px"
                                    }}>
                                        <strong>User:</strong><br />
                                        <div style={{ whiteSpace: "pre-wrap" }}>
                                            {message.query.user_prompt}
                                        </div>
                                        <small className="text-muted">
                                            {new Date(message.query.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                )}
                                {message.response && (
                                    <div className="message-ai p-3" style={{
                                        backgroundColor: "#f7f7f7",
                                        borderLeft: "5px solid #28a745",
                                        borderRadius: "5px"
                                    }}>
                                        <strong>Assistant:</strong><br />
                                        <div style={{ whiteSpace: "pre-wrap" }}>
                                            {message.response}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Latest Response Section (like PHP) */}
                {messages.length > 0 && messages[messages.length - 1].response && (
                    <div className="latest-response mb-4">
                        <h6 style={{ color: "#28a745" }}>💡 Latest Response:</h6>
                        <div className="response p-3" style={{
                            backgroundColor: "#f0f0f0",
                            borderRadius: "5px",
                            whiteSpace: "pre-wrap"
                        }}>
                            {messages[messages.length - 1].response}
                        </div>
                    </div>
                )}
                
                {isTyping && (
                    <div className="ai-thinking">
                        <div className="typing-indicator me-2">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div>
                            <strong>AI is generating your response...</strong><br />
                            <small className="text-muted">
                                Using OpenAI GPT-3.5 Turbo • This may take a few seconds
                            </small>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <PublicChatInput onSendMessage={sendMessage} chatType={chatType} />
        </div>
    );
};

// Simple chat input component for public chats
const PublicChatInput = ({ onSendMessage, chatType }) => {
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() || files.length > 0) {
            onSendMessage(message, files);
            setMessage('');
            setFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    return (
        <div className="chat-input-container p-4 border-top" style={{ backgroundColor: "#fffaf1" }}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "#C72030" }}>
                        What do you want help with?
                    </label>
                    <textarea
                        className="form-control"
                        placeholder="E.g., Write a professional email to a client, help me brainstorm ideas, explain a concept..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        rows={3}
                        style={{ 
                            resize: 'vertical',
                            fontSize: '15px',
                            padding: '12px'
                        }}
                        required
                    />
                </div>
                
                {chatType === 'image' && (
                    <div className="mb-3">
                        <label className="form-label">Upload Images (optional)</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="form-control"
                        />
                        {files.length > 0 && (
                            <small className="text-success mt-1 d-block">
                                ✓ {files.length} file(s) selected
                            </small>
                        )}
                    </div>
                )}
                
                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn px-4 py-2"
                        style={{ 
                            backgroundColor: "#007bff", 
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "15px",
                            fontWeight: "500"
                        }}
                        disabled={!message.trim() && files.length === 0}
                    >
                        Generate Response
                    </button>
                    
                    <button
                        type="button"
                        className="btn px-4 py-2"
                        style={{ 
                            backgroundColor: "#dc3545", 
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "15px"
                        }}
                        onClick={() => {
                            setMessage('');
                            setFiles([]);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                    >
                        Clear Input
                    </button>
                </div>
                
                <div className="mt-2">
                    <small className="text-muted">
                        💡 Tip: Be specific about what you need help with for better results
                    </small>
                </div>
            </form>
        </div>
    );
};

export default PublicChatArea;
