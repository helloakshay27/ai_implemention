import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PublicChatMessage from './PublicChatMessage';
import { publicChatAPI } from '../services/PublicChatAPI';

// Create a simple event system for communication between components
const eventBus = {
    listeners: {},
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    },
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    },
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
};

const PublicChatArea = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get type from URL or localStorage, default to 'general'
    const typeFromUrl = searchParams.get('type');
    const typeFromStorage = localStorage.getItem(`chat_type_${id}`);
    const chatType = typeFromUrl || typeFromStorage || 'general';
    
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
        // Ensure type is always in URL and localStorage
        if (!typeFromUrl && chatType) {
            // If type is missing from URL, add it
            setSearchParams({ type: chatType }, { replace: true });
        }
        
        // Save chat type to localStorage for this chat
        if (chatType) {
            localStorage.setItem(`chat_type_${id}`, chatType);
        }
    }, [id, chatType, typeFromUrl, setSearchParams]);

    useEffect(() => {
        // Load messages from localStorage for this chat
        const savedMessages = localStorage.getItem(`public_messages_${id}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        // Listen for new messages from input component
        const handleNewMessage = (data) => {
            sendMessage(data.content, data.files, data.chatType || chatType);
        };

        eventBus.on('sendMessage', handleNewMessage);

        return () => {
            eventBus.off('sendMessage', handleNewMessage);
        };
    }, [id]);

    const saveMessages = (newMessages) => {
        localStorage.setItem(`public_messages_${id}`, JSON.stringify(newMessages));
        // Dispatch custom event to notify sidebar to reload
        window.dispatchEvent(new Event('chatUpdated'));
    };

    const sendMessage = async (content, files = [], messageType = chatType) => {
        if (!content.trim() && files.length === 0) return;

        console.log('📨 PublicChatArea.sendMessage called:', { content, messageType, files, id });

        // Create image preview URLs for uploaded images
        const imagePreviews = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type
        }));

        const userMessage = {
            message_id: Date.now(),
            query: {
                id: Date.now(),
                user_prompt: content,
                timestamp: new Date().toISOString(),
                type: messageType,
                files: files,
                imagePreviews: imagePreviews // Store preview URLs for display
            },
            response: null,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);

        setIsTyping(true);

        try {
            console.log('🔄 Calling OpenAI API...');
            // Use the OpenAI API service with proper type
            const apiResponse = await publicChatAPI.sendMessage(content, messageType, files, id);
            console.log('✅ API Response received:', apiResponse);
            
            if (apiResponse.error) {
                console.error('❌ API returned error:', apiResponse);
                
                // Enhanced error message with recovery suggestions
                let errorText = apiResponse.message || "Sorry, I encountered an error with the AI service. Please try again.";
                
                // Add recovery suggestions if available
                if (apiResponse.recoverySuggestions && apiResponse.recoverySuggestions.length > 0) {
                    errorText += "\n\n**💡 Suggestions:**\n" + 
                        apiResponse.recoverySuggestions.map((s, i) => `${i + 1}. ${s}`).join('\n');
                }
                
                // Add helpful note for vision errors
                if (apiResponse.isVisionError) {
                    errorText += "\n\n_Note: You can still chat normally by sending messages without images._";
                }
                
                const errorMessage = {
                    message_id: Date.now() + 1,
                    query: null,
                    response: {
                        response: errorText,
                        isError: true, // Flag for special styling
                        isVisionError: apiResponse.isVisionError || false
                    },
                    logs: apiResponse.logs || [
                        { 
                            log_id: Date.now(), 
                            step: 'Error',
                            log_message: 'Failed to get response from AI service',
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
                
                const finalMessages = [...updatedMessages, errorMessage];
                setMessages(finalMessages);
                saveMessages(finalMessages);
            } else {
                const botMessage = {
                    message_id: Date.now() + 1,
                    query: null,
                    response: {
                        response: apiResponse.response?.response || apiResponse.response?.message || "No response received from AI.",
                        generatedImages: apiResponse.response?.generatedImages || null, // DALL-E generated images
                        uploadedImages: apiResponse.response?.uploadedImages || null, // Vision analysis images
                        revised_prompt: apiResponse.response?.revised_prompt || null
                    },
                    logs: apiResponse.logs || [
                        { 
                            log_id: Date.now(), 
                            step: 'Success',
                            log_message: 'Message processed successfully',
                            timestamp: new Date().toISOString()
                        }
                    ]
                };

                const finalMessages = [...updatedMessages, botMessage];
                setMessages(finalMessages);
                saveMessages(finalMessages);
                console.log('✅ Messages updated successfully:', { botMessage });
            }
        } catch (error) {
            console.error('❌ Unexpected error in sendMessage:', error);
            const errorMessage = {
                message_id: Date.now() + 1,
                query: null,
                response: {
                    response: "Sorry, I encountered an unexpected error. Please try again."
                },
                logs: [
                    { 
                        log_id: Date.now(), 
                        step: 'Error',
                        log_message: `Unexpected error: ${error.message}`,
                        timestamp: new Date().toISOString()
                    }
                ]
            };
            
            const finalMessages = [...updatedMessages, errorMessage];
            setMessages(finalMessages);
            saveMessages(finalMessages);
        } finally {
            setIsTyping(false);
            console.log('🏁 sendMessage completed');
        }
    };

    return (
        <div className='chat-area'>
            {messages && messages.map((message) => {
                return (
                    <PublicChatMessage key={message.message_id || message.id} message={message} />
                );
            })}

            {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                    <div className="typing-bubble p-3" style={{
                        backgroundColor: "#f1f1f1",
                        borderRadius: "18px",
                        maxWidth: "250px"
                    }}>
                        <div className="d-flex align-items-center gap-2">
                            {/* SVG Typing Animation */}
                            <svg width="50" height="30" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="30" r="8" fill="#C72030">
                                    <animate
                                        attributeName="cy"
                                        values="30;15;30"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                        begin="0s"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        values="1;0.5;1"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                        begin="0s"
                                    />
                                </circle>
                                <circle cx="60" cy="30" r="8" fill="#C72030">
                                    <animate
                                        attributeName="cy"
                                        values="30;15;30"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                        begin="0.2s"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        values="1;0.5;1"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                        begin="0.2s"
                                    />
                                </circle>
                                <circle cx="100" cy="30" r="8" fill="#C72030">
                                    <animate
                                        attributeName="cy"
                                        values="30;15;30"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                        begin="0.4s"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        values="1;0.5;1"
                                        dur="0.8s"
                                        repeatCount="indefinite"
                                        begin="0.4s"
                                    />
                                </circle>
                            </svg>
                            {/* <small className="text-muted">AI is thinking...</small> */}
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

// Export the event bus for use by PublicInputBox
export { eventBus };
export default PublicChatArea;
