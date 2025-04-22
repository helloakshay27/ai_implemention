import { Send, Mic, Pin, PinOff, Paperclip } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../contexts/chatContext';
import axios from 'axios';
import InputBox from './InputBox';

const ChatInput = () => {
   const { chats, currentChatId, isTyping } = useChatContext();
       const currentChat = chats.find((chat) => chat.id === currentChatId);
       const messagesEndRef = useRef(null);


    return (
        <>
        {currentChat?.messages?.length>0 && (
        <div className="border-top p-3 chat-input" style={{
            background: "#FCFBF9",
        }}>
            <InputBox />
            {/* Recording Overlay
            {isRecording && (
                <div className="recording-overlay">
                    <div className="recording-indicator">
                        <span className="recording-dot"></span>
                        <span>Voice in progress...</span>
                    </div>
                </div>
            )} */}
        </div>
        )
    }
    </>
    );
};

export default ChatInput;
