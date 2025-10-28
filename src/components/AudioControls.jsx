import React, { useState, useRef, useEffect } from 'react';
import { publicChatAPI } from '../services/PublicChatAPI';

/**
 * Audio component for voice recording (STT) and text-to-speech (TTS)
 * Supports Whisper transcription and OpenAI TTS with multiple voices
 */
const AudioControls = ({ onTranscription, onAudioGenerated }) => {
    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcribing, setTranscribing] = useState(false);
    const [transcription, setTranscription] = useState(null);
    
    // TTS state
    const [ttsText, setTtsText] = useState('');
    const [ttsVoice, setTtsVoice] = useState('alloy');
    const [ttsModel, setTtsModel] = useState('tts-1');
    const [ttsSpeed, setTtsSpeed] = useState(1.0);
    const [generating, setGenerating] = useState(false);
    const [generatedAudio, setGeneratedAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // Refs
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const audioPlayerRef = useRef(null);

    const [error, setError] = useState(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (generatedAudio?.audioUrl) URL.revokeObjectURL(generatedAudio.audioUrl);
        };
    }, [generatedAudio]);

    // Start recording
    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            setError(`Failed to start recording: ${err.message}`);
            console.error('Recording error:', err);
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    // Transcribe recorded audio
    const transcribeAudio = async () => {
        if (!audioBlob) {
            setError('No audio to transcribe');
            return;
        }

        setTranscribing(true);
        setError(null);

        try {
            // Convert webm to a format Whisper accepts (or send as is)
            const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
            
            const result = await publicChatAPI.transcribeAudio(audioFile, {
                model: 'whisper-1',
                response_format: 'json',
                temperature: 0
            });

            if (result.error) {
                setError(result.message);
            } else if (result.success) {
                const text = typeof result.transcription === 'string' 
                    ? result.transcription 
                    : result.transcription.text;
                
                setTranscription(text);
                if (onTranscription) {
                    onTranscription(text);
                }
            }
        } catch (err) {
            setError(`Transcription failed: ${err.message}`);
        } finally {
            setTranscribing(false);
        }
    };

    // Generate speech from text
    const generateSpeech = async () => {
        if (!ttsText.trim()) {
            setError('Please enter text to convert to speech');
            return;
        }

        setGenerating(true);
        setError(null);

        try {
            const result = await publicChatAPI.textToSpeech(ttsText, {
                model: ttsModel,
                voice: ttsVoice,
                response_format: 'mp3',
                speed: ttsSpeed
            });

            if (result.error) {
                setError(result.message);
            } else if (result.success) {
                setGeneratedAudio(result);
                if (onAudioGenerated) {
                    onAudioGenerated(result);
                }
            }
        } catch (err) {
            setError(`Speech generation failed: ${err.message}`);
        } finally {
            setGenerating(false);
        }
    };

    // Play generated audio
    const playAudio = () => {
        if (audioPlayerRef.current && generatedAudio?.audioUrl) {
            if (isPlaying) {
                audioPlayerRef.current.pause();
                setIsPlaying(false);
            } else {
                audioPlayerRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="audio-controls">
            {/* Voice Recording Section */}
            <div className="audio-section recording-section">
                <h3>🎤 Voice Recording (Whisper STT)</h3>
                
                <div className="recording-controls">
                    {!isRecording ? (
                        <button onClick={startRecording} className="record-btn">
                            Start Recording
                        </button>
                    ) : (
                        <button onClick={stopRecording} className="record-btn recording">
                            Stop Recording ({formatTime(recordingTime)})
                        </button>
                    )}
                </div>

                {audioBlob && !isRecording && (
                    <div className="recorded-audio">
                        <p>✅ Recording ready ({formatTime(recordingTime)})</p>
                        <audio controls src={URL.createObjectURL(audioBlob)} />
                        
                        <button 
                            onClick={transcribeAudio} 
                            disabled={transcribing}
                            className="transcribe-btn"
                        >
                            {transcribing ? 'Transcribing...' : 'Transcribe Audio'}
                        </button>
                    </div>
                )}

                {transcription && (
                    <div className="transcription-result">
                        <h4>Transcription:</h4>
                        <p className="transcription-text">{transcription}</p>
                    </div>
                )}
            </div>

            {/* Text-to-Speech Section */}
            <div className="audio-section tts-section">
                <h3>🔊 Text-to-Speech (OpenAI TTS)</h3>
                
                <div className="form-group">
                    <label>Text</label>
                    <textarea
                        value={ttsText}
                        onChange={(e) => setTtsText(e.target.value)}
                        placeholder="Enter text to convert to speech..."
                        rows={4}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Voice</label>
                        <select value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}>
                            <option value="alloy">Alloy</option>
                            <option value="echo">Echo</option>
                            <option value="fable">Fable</option>
                            <option value="onyx">Onyx</option>
                            <option value="nova">Nova</option>
                            <option value="shimmer">Shimmer</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Model</label>
                        <select value={ttsModel} onChange={(e) => setTtsModel(e.target.value)}>
                            <option value="tts-1">TTS-1 (Faster)</option>
                            <option value="tts-1-hd">TTS-1-HD (Higher Quality)</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Speed: {ttsSpeed}x</label>
                    <input
                        type="range"
                        min="0.25"
                        max="4.0"
                        step="0.25"
                        value={ttsSpeed}
                        onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                    />
                </div>

                <button 
                    onClick={generateSpeech} 
                    disabled={generating || !ttsText.trim()}
                    className="generate-speech-btn"
                >
                    {generating ? 'Generating Speech...' : 'Generate Speech'}
                </button>

                {generatedAudio && (
                    <div className="generated-audio">
                        <h4>Generated Speech:</h4>
                        <audio 
                            ref={audioPlayerRef}
                            controls 
                            src={generatedAudio.audioUrl}
                            onEnded={() => setIsPlaying(false)}
                        />
                        <div className="audio-info">
                            <p>Voice: {generatedAudio.voice}</p>
                            <p>Format: {generatedAudio.format}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="audio-error">
                    ⚠️ {error}
                </div>
            )}
        </div>
    );
};

export default AudioControls;
