import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Send, Mic, PinOff, Paperclip, SendHorizonal } from 'lucide-react';
import axios from 'axios';
import { useChatContext } from "../contexts/chatContext";
import { toast } from 'react-hot-toast';

const InputBox = ({ id }) => {
    const { sendMessage, mode } = useChatContext();

    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);



    const recognitionRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef();

    const token = localStorage.getItem('access_token');

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


    const handleUnpinAll = async () => {
        try {
            const response = await axios.post(`https://ai-implementation.lockated.com/unpin-all/?token=${token}`);
            if (response.data.success) {
                toast.success("Unpinned all messages successfully");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input, [], [], id);
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

    const handleFileChange = async (event) => {
        const files = event.target.files;

        if (!files.length) return;

        const formData = new FormData();

        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post(`https://ai-implementation.lockated.com/upload/?token=${token}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    };

    const handleUploadFile = () => {
        fileInputRef.current?.click();
    }
    return (
        <div className='d-flex w-100 align-items-center gap-4 justify-content-center'>
            <form className="w-100 position-relative form" onSubmit={handleSubmit}>
                <Paperclip
                    className='position-absolute cursor-pointer'
                    style={{
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "inherit"
                    }}
                    onClick={handleUploadFile}
                    size={20}
                    color='#C72030'
                />

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    multiple
                />

                <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);

                        const textarea = e.target;
                        textarea.style.height = "auto"; // Reset height
                        const maxHeight = 5 * 24; // Assuming approx 24px per line
                        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Ask Me Anything..."
                    className="w-100 py-3 input text-black"
                    style={{
                        paddingLeft: "3rem",
                        paddingRight: "10rem",
                        overflow: 'hidden',
                        resize: 'none',
                        lineHeight: "24px",
                        outline: "none"
                    }}
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
                        right: "100px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: isRecording ? "red" : "",
                        color: isRecording ? "white" : "inherit"
                    }}
                >
                    <Mic size={20} color='#C72030' />
                </button>

                <button
                    type="button"
                    className={`position-absolute p-2 border-0 rounded-1 voice-btn`}
                    onClick={handleUnpinAll}
                    style={{
                        right: "60px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "inherit"
                    }}
                >
                    <PinOff size={20} color='#C72030' />
                </button>

                {/* Send Button */}
                <button
                    type="submit"
                    className="position-absolute p-2 border-0 rounded-1 submit-btn"
                    disabled={!input.trim()}
                    aria-label="Send message"
                    style={{ right: "20px", top: "50%", transform: "translateY(-50%)" }}
                >
                    <SendHorizonal size={20} color='#C72030' />
                </button>
            </form>

            {isRecording && (
                <div className="recording-overlay">
                    <div className="recording-indicator">
                        <span className="recording-dot"></span>
                        <span>Voice in progress...</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InputBox