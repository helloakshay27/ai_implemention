import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Paperclip, SendHorizonal, X, Image as ImageIcon } from 'lucide-react';
import { eventBus } from './PublicChatAreaNew';

const PublicInputBox = ({ id, chatType }) => {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [files, setFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const recognitionRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef();

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

    // Clear files when chat ID changes (new chat)
    useEffect(() => {
        setFiles([]);
        setImagePreviews([]);
        setInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && files.length === 0) return;

        // Send message via event bus to PublicChatArea
        eventBus.emit('sendMessage', {
            content: input,
            files: files,
            chatType: chatType
        });

        // Clear all states and reset file input
        setInput('');
        setFiles([]);
        setImagePreviews([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input element
        }
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

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        
        // For image chat, replace files instead of appending
        if (chatType === 'image') {
            setFiles(selectedFiles);
            setImagePreviews([]);
        } else {
            // For other chat types, append files
            setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        }
        
        // Create image previews for ALL image files, regardless of chat type
        selectedFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, {
                        file: file,
                        preview: reader.result,
                        name: file.name
                    }]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeFile = (indexToRemove) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadFile = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className='d-flex w-100 flex-column align-items-center gap-2'>
            {/* Image Previews Section - Show for ALL chat types when images are attached */}
            {imagePreviews.length > 0 && (
                <div className="w-100 image-preview-container">
                    <div className="image-preview-grid">
                        {imagePreviews.map((preview, index) => (
                            <div 
                                key={index}
                                className="image-preview-item"
                            >
                                <img
                                    src={preview.preview}
                                    alt={preview.name}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="image-preview-remove"
                                    title="Remove image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2">
                        <small style={{ color: '#6b6b6b', fontSize: '12px' }}>
                            {imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''} attached
                        </small>
                    </div>
                </div>
            )}

            {/* Regular File Attachments for non-image files */}
            {files.length > imagePreviews.length && (
                <div className="w-100 file-attachment-container">
                    <div className="d-flex flex-column gap-2">
                        {files.map((file, index) => {
                            // Only show non-image files here (images are shown above)
                            if (!file.type.startsWith('image/')) {
                                return (
                                    <div 
                                        key={index}
                                        className="file-attachment-item d-flex align-items-center justify-content-between"
                                    >
                                        <div className="d-flex align-items-center gap-2">
                                            <Paperclip size={16} color="#6b6b6b" />
                                            <small style={{ color: '#202123', fontSize: '13px' }}>
                                                {file.name}
                                            </small>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="border-0 bg-transparent p-0"
                                            style={{ cursor: 'pointer' }}
                                            title="Remove file"
                                        >
                                            <X size={16} color="#6b6b6b" />
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            )}

            <div className='d-flex w-100 align-items-center gap-4 justify-content-center'>
            <form className="w-100 position-relative form" onSubmit={handleSubmit}>
                {/* Attachment button - properly aligned */}
                <button
                    type="button"
                    className="position-absolute p-2 border-0 rounded-1"
                    onClick={handleUploadFile}
                    title="Attach file"
                    aria-label="Attach file"
                    style={{
                        left: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10
                    }}
                >
                    <Paperclip size={20} color='#C72030' />
                    {files.length > 0 && (
                        <span 
                            className="attachment-badge" 
                            style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                backgroundColor: '#C72030',
                                color: 'white',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {files.length}
                        </span>
                    )}
                </button>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    multiple
                    accept={chatType === 'image' ? 'image/*' : '*/*'}
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
                    placeholder={
                        chatType === 'image' 
                            ? (imagePreviews.length > 0 ? "Describe what you want to know about the image..." : "Ask Me Anything...")
                            : chatType === 'structured'
                            ? "Ask about structured data..."
                            : imagePreviews.length > 0 
                                ? "Ask Me Anything..."
                                : "Ask Me Anything..."
                    }
                    className="w-100 py-3 input text-black"
                    style={{
                        paddingLeft: "3.5rem",
                        paddingRight: "7rem",
                        overflow: 'hidden',
                        resize: 'none',
                        lineHeight: "24px",
                        outline: "none",
                        borderRadius: "8px",
                        border: "1px solid rgba(0,0,0,0.1)"
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
                        right: "60px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: isRecording ? "red" : "transparent",
                        color: isRecording ? "white" : "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                    }}
                >
                    <Mic size={20} color={isRecording ? 'white' : '#C72030'} />
                </button>

                {/* Send Button */}
                <button
                    type="submit"
                    className="position-absolute p-2 border-0 rounded-1 submit-btn"
                    disabled={!input.trim() && files.length === 0}
                    aria-label="Send message"
                    style={{ 
                        right: "15px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        opacity: (!input.trim() && files.length === 0) ? 0.5 : 1,
                        cursor: (!input.trim() && files.length === 0) ? 'not-allowed' : 'pointer',
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
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
        </div>
    );
};

export default PublicInputBox;
