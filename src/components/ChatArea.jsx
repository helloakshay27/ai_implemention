import React, { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../contexts/chatContext';
import ChatMessage from './ChatMessage';
import PromptModal from './PromptModal';
import BRDTable from './BRDTable';
import { useParams } from 'react-router-dom';

const ChatArea = () => {
    const { id } = useParams();
    const wsRef = useRef(null);

    const { isTyping, mode, messages, setLogs } = useChatContext();
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

    const stripAnsi = (str) => {
        return str.replace(
            // Regex for ANSI escape sequences
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ''
        ).replace(/\.{1,}$/, '');
    };

    useEffect(() => {
        const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";

        wsRef.current = new WebSocket(`${ws_scheme}://43.204.42.235:8000/ws/chat/${id}/`);

        wsRef.current.onopen = () => {
            console.log("WebSocket connection established");
        };

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "log") {
                    const cleanLog = stripAnsi(data.log).trim();

                    const isStructuredObjectLog = cleanLog == "" || cleanLog.includes("api_token") || cleanLog.startsWith("{") || cleanLog.startsWith("[") && cleanLog.includes("'user_prompt':") || cleanLog.includes("'response':") || cleanLog.includes("'message':");

                    if (isStructuredObjectLog) {
                        setLogs("Thinking");
                    } else {
                        setLogs(cleanLog.length > 80 ? cleanLog.slice(0, 80) : cleanLog);
                    }
                }
            } catch (err) {
                console.error("Failed to parse WebSocket message:", err);
            }
        };


        wsRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        wsRef.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [])

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