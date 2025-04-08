import { Send, Mic, Pin } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../contexts/chatContext';

const ChatInput = () => {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);
    const { sendMessage } = useChatContext();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();

        // Setup SpeechRecognition if available
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognition.onerror = (err) => {
                console.error('Speech recognition error:', err);
            };
            recognitionRef.current = recognition;
        } else {
            console.error("SpeechRecognition API is not supported in this browser.");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
        inputRef.current?.focus();
    };


    const handleVoiceInput = () => {
        if (!isRecording) {
            // Start voice recognition
            recognitionRef.current?.start();
            setIsRecording(true);
            console.log("Voice recognition started...");
        } else {
            // Stop voice recognition
            recognitionRef.current?.stop();
            setIsRecording(false);
            console.log("Voice recognition stopped...");
        }
    };

    return (
        <div className="border-top p-3">
            <form className="mx-auto position-relative form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="w-100 p-3 input rounded-2 border bg-transparent text-white"
                    aria-label="Chat message input"
                />

                
                {/* Voice Message Button */}
                <button
                    type="button"
                    className={`position-absolute p-2 border-0 rounded-1 voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={handleVoiceInput}
                    title={isRecording ? "Stop Voice Input" : "Record Voice Message"}
                    aria-label="Record Voice Message"
                    style={{
                        right: "60px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: isRecording ? "red" : "",
                        color: isRecording ? "white" : "inherit"
                    }}
                >
                    <Mic size={20} />
                </button>

                {/* Send Button */}
                <button
                    type="submit"
                    className="position-absolute p-2 border-0 rounded-1 submit-btn"
                    disabled={!input.trim()}
                    aria-label="Send message"
                    style={{ right: "20px", top: "50%", transform: "translateY(-50%)" }}
                >
                    <Send size={20} />
                </button>
            </form>

            {/* Recording Overlay */}
            {isRecording && (
                <div className="recording-overlay">
                    <div className="recording-indicator">
                        <span className="recording-dot"></span>
                        <span>Voice in progress...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInput;
