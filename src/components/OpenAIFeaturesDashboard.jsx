import React, { useState } from 'react';
import ImageGenerationModal from './ImageGenerationModal';
import AudioControls from './AudioControls';
import { publicChatAPI } from '../services/PublicChatAPI';

/**
 * Example component demonstrating how to use all OpenAI API features:
 * - Text chat (GPT-3.5/GPT-4)
 * - Vision (GPT-4 Vision with image uploads)
 * - Image Generation (DALL-E 3)
 * - Image Editing (DALL-E)
 * - Image Variations (DALL-E)
 * - Audio Transcription (Whisper STT)
 * - Text-to-Speech (OpenAI TTS)
 */
const OpenAIFeaturesDashboard = () => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [showAudioPanel, setShowAudioPanel] = useState(false);
    const [messages, setMessages] = useState([]);

    // Handle image generation completion
    const handleImageGenerated = (images) => {
        console.log('Images generated:', images);
        // You can add the generated images to your chat or display them
        setMessages(prev => [...prev, {
            type: 'image',
            content: 'Generated images:',
            images: images,
            timestamp: new Date().toISOString()
        }]);
    };

    // Handle audio transcription completion
    const handleTranscription = (text) => {
        console.log('Transcription received:', text);
        // You can use the transcribed text as input for chat
        setMessages(prev => [...prev, {
            type: 'transcription',
            content: text,
            timestamp: new Date().toISOString()
        }]);
    };

    // Handle TTS audio generation
    const handleAudioGenerated = (audioData) => {
        console.log('Audio generated:', audioData);
        setMessages(prev => [...prev, {
            type: 'audio',
            content: 'Generated speech',
            audioUrl: audioData.audioUrl,
            timestamp: new Date().toISOString()
        }]);
    };

    return (
        <div className="openai-dashboard">
            <div className="dashboard-header">
                <h1>🤖 OpenAI Features Dashboard</h1>
                <p>Explore all available AI capabilities</p>
            </div>

            <div className="features-grid">
                {/* Text Chat */}
                <div className="feature-card">
                    <div className="feature-icon">💬</div>
                    <h3>Text Chat</h3>
                    <p>Chat with GPT-3.5 or GPT-4 for general conversations, Q&A, and problem-solving.</p>
                    <div className="feature-usage">
                        <code>await publicChatAPI.sendMessage(text, 'general')</code>
                    </div>
                </div>

                {/* Vision */}
                <div className="feature-card">
                    <div className="feature-icon">👁️</div>
                    <h3>Vision (GPT-4)</h3>
                    <p>Analyze images with GPT-4 Vision. Upload images and ask questions about them.</p>
                    <div className="feature-usage">
                        <code>await publicChatAPI.sendMessage(text, 'image', files)</code>
                    </div>
                </div>

                {/* Image Generation */}
                <div className="feature-card">
                    <div className="feature-icon">🎨</div>
                    <h3>Image Generation</h3>
                    <p>Generate images from text descriptions using DALL-E 3.</p>
                    <button onClick={() => setShowImageModal(true)} className="try-btn">
                        Try It Out
                    </button>
                    <div className="feature-usage">
                        <code>await publicChatAPI.generateImage(prompt, options)</code>
                    </div>
                </div>

                {/* Image Editing */}
                <div className="feature-card">
                    <div className="feature-icon">✏️</div>
                    <h3>Image Editing</h3>
                    <p>Edit existing images by providing a mask and description.</p>
                    <button onClick={() => setShowImageModal(true)} className="try-btn">
                        Try It Out
                    </button>
                    <div className="feature-usage">
                        <code>await publicChatAPI.editImage(image, prompt, mask)</code>
                    </div>
                </div>

                {/* Image Variations */}
                <div className="feature-card">
                    <div className="feature-icon">🔄</div>
                    <h3>Image Variations</h3>
                    <p>Create variations of an existing image automatically.</p>
                    <button onClick={() => setShowImageModal(true)} className="try-btn">
                        Try It Out
                    </button>
                    <div className="feature-usage">
                        <code>await publicChatAPI.createImageVariation(image)</code>
                    </div>
                </div>

                {/* Audio Transcription */}
                <div className="feature-card">
                    <div className="feature-icon">🎤</div>
                    <h3>Speech-to-Text</h3>
                    <p>Transcribe audio to text using Whisper AI.</p>
                    <button onClick={() => setShowAudioPanel(!showAudioPanel)} className="try-btn">
                        {showAudioPanel ? 'Hide' : 'Try It Out'}
                    </button>
                    <div className="feature-usage">
                        <code>await publicChatAPI.transcribeAudio(audioFile)</code>
                    </div>
                </div>

                {/* Text-to-Speech */}
                <div className="feature-card">
                    <div className="feature-icon">🔊</div>
                    <h3>Text-to-Speech</h3>
                    <p>Convert text to natural-sounding speech with multiple voices.</p>
                    <button onClick={() => setShowAudioPanel(!showAudioPanel)} className="try-btn">
                        {showAudioPanel ? 'Hide' : 'Try It Out'}
                    </button>
                    <div className="feature-usage">
                        <code>await publicChatAPI.textToSpeech(text, options)</code>
                    </div>
                </div>

                {/* Structured Data */}
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Structured Data</h3>
                    <p>Analyze and process structured data, CSV, JSON, and more.</p>
                    <div className="feature-usage">
                        <code>await publicChatAPI.sendMessage(text, 'structured')</code>
                    </div>
                </div>
            </div>

            {/* Audio Controls Panel */}
            {showAudioPanel && (
                <div className="audio-panel">
                    <AudioControls
                        onTranscription={handleTranscription}
                        onAudioGenerated={handleAudioGenerated}
                    />
                </div>
            )}

            {/* Messages Display */}
            {messages.length > 0 && (
                <div className="messages-display">
                    <h2>Activity Log</h2>
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-item message-${msg.type}`}>
                            <div className="message-timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                            <div className="message-content">
                                <strong>{msg.type}:</strong> {msg.content}
                                {msg.images && (
                                    <div className="message-images">
                                        {msg.images.map((img, i) => (
                                            <img key={i} src={img.url} alt={`Generated ${i}`} />
                                        ))}
                                    </div>
                                )}
                                {msg.audioUrl && (
                                    <audio controls src={msg.audioUrl} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Generation Modal */}
            <ImageGenerationModal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                onImageGenerated={handleImageGenerated}
            />

            {/* API Reference */}
            <div className="api-reference">
                <h2>📚 API Reference</h2>
                
                <div className="api-method">
                    <h3>Chat with Vision</h3>
                    <pre>{`// Send text message
const result = await publicChatAPI.sendMessage(
    "Hello, how are you?",
    "general"
);

// Send message with images (GPT-4 Vision)
const result = await publicChatAPI.sendMessage(
    "What's in this image?",
    "image",
    [imageFile1, imageFile2]
);`}</pre>
                </div>

                <div className="api-method">
                    <h3>Image Generation</h3>
                    <pre>{`// Generate image with DALL-E 3
const result = await publicChatAPI.generateImage(
    "A serene mountain landscape at sunset",
    {
        model: 'dall-e-3',
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid',
        n: 1
    }
);

// Access generated image
console.log(result.images[0].url);`}</pre>
                </div>

                <div className="api-method">
                    <h3>Image Editing</h3>
                    <pre>{`// Edit image with mask
const result = await publicChatAPI.editImage(
    imageFile,
    "Add a sunset in the background",
    maskFile,
    { size: '1024x1024', n: 1 }
);`}</pre>
                </div>

                <div className="api-method">
                    <h3>Image Variations</h3>
                    <pre>{`// Create variations
const result = await publicChatAPI.createImageVariation(
    imageFile,
    { n: 3, size: '1024x1024' }
);`}</pre>
                </div>

                <div className="api-method">
                    <h3>Speech-to-Text (Whisper)</h3>
                    <pre>{`// Transcribe audio
const result = await publicChatAPI.transcribeAudio(
    audioFile,
    {
        language: 'en',
        response_format: 'json'
    }
);

console.log(result.transcription.text);`}</pre>
                </div>

                <div className="api-method">
                    <h3>Text-to-Speech</h3>
                    <pre>{`// Generate speech
const result = await publicChatAPI.textToSpeech(
    "Hello, this is a test of text to speech!",
    {
        model: 'tts-1-hd',
        voice: 'alloy',
        speed: 1.0
    }
);

// Play audio
const audio = new Audio(result.audioUrl);
audio.play();`}</pre>
                </div>
            </div>
        </div>
    );
};

export default OpenAIFeaturesDashboard;
