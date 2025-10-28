import {
  Bot,
  Copy,
  Download,
  LayoutTemplate,
  Pin,
  Share2,
  User,
  Volume2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import Markdown from "react-markdown";
import RemoveMarkdown from "remove-markdown";
import remarkGfm from 'remark-gfm';
import PublicLogJourney from "./PublicLogJourney";
import DownloadModal from "./Download";

const PublicChatMessage = ({ message }) => {
  const { id } = useParams();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [showLogs, setShowLogs] = useState(true);
  const [pin, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const synthVoices = window.speechSynthesis.getVoices();
      if (synthVoices.length) {
        setVoices(synthVoices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const raw = message?.response?.response;
    const cleanText = RemoveMarkdown(raw);

    if (!voices.length) {
      toast.error("Voices not loaded yet");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.voice = voices[2] || voices[0];

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(message?.response?.response)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const handleShare = () => {
    const subject = encodeURIComponent("Shared Message");
    const body = encodeURIComponent(
      message.response?.response || message.content || "No content available"
    );
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, "_blank");
  };

  const handlePin = async () => {
    setLoading(true);
    try {
      // For public chat, we'll just simulate pinning locally
      setPinned(true);
      toast.success("Pinned successfully (local only)");
    } catch (error) {
      toast.error("Failed to pin message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpin = async () => {
    setLoading(true);
    try {
      // For public chat, we'll just simulate unpinning locally
      setPinned(false);
      toast.success("Unpinned successfully (local only)");
    } catch (error) {
      toast.error("Failed to unpin message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateDownload = () => {
    // Simple download functionality for public chat
    const element = document.createElement("a");
    const file = new Blob([message?.response?.response || ""], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "chat-response.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded successfully");
  };

  // Helper function to fix markdown tables
  const fixMarkdownTables = (text) => {
    if (!text) return text;
    
    // Fix table formatting
    return text
      .replace(/\|(?!\s)/g, '| ')
      .replace(/(?<!\s)\|/g, ' |')
      .replace(/\|\s*\|/g, '|   |');
  };

  return (
    <>
      <div>
        {/* User Message */}
        {message?.query && (
          <div className="d-flex align-items-start justify-content-end mb-3">
            <div className="message px-3 py-2 user-message">
              <div style={{ whiteSpace: "pre-wrap" }}>
                {message.query.user_prompt}
              </div>
              
              {/* Display uploaded image previews in user message */}
              {message.query.imagePreviews && message.query.imagePreviews.length > 0 && (
                <div className="mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {message.query.imagePreviews.map((preview, idx) => (
                    <div key={idx} style={{ position: 'relative', maxWidth: '200px' }}>
                      <img 
                        src={preview.url} 
                        alt={preview.name || `Uploaded ${idx + 1}`}
                        style={{ 
                          width: '100%', 
                          height: 'auto', 
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#666', 
                        marginTop: '4px',
                        wordBreak: 'break-all'
                      }}>
                        {preview.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <User className="ms-2 mt-3" style={{ color: "grey" }} size={24} />
          </div>
        )}

        {/* Bot Response with Logs */}
        {message?.response?.response && (
          <>
            {/* Logs Section */}
            {/* {message?.logs && message.logs.length > 0 && (
              <div className="d-flex align-items-start justify-content-start mb-2">
                <Bot className="me-2 mt-3" style={{ color: "grey" }} size={24} />
                <div className="message px-3 py-2 bot-message align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary mb-2"
                    onClick={() => setShowLogs((prev) => !prev)}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {showLogs ? "Hide Process ▲" : "Show Process ▼"}
                  </button>
                  {showLogs && <PublicLogJourney logs={message.logs} />}
                </div>
              </div>
            )} */}

            {/* Main Response */}
            <div className="d-flex align-items-start justify-content-start mb-3">
              <Bot className="me-2 mt-3" style={{ color: message.response.isError ? "#dc3545" : "grey" }} size={24} />
              <div 
                className="message px-3 py-2 bot-message align-items-center"
                style={{
                  ...(message.response.isError && {
                    borderLeft: '4px solid #dc3545',
                    backgroundColor: '#fff5f5'
                  })
                }}
              >
                {/* Display DALL-E generated images (for type "image") */}
                {message.response.generatedImages && message.response.generatedImages.length > 0 && (
                  <div className="mb-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {message.response.generatedImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img 
                          src={img.url} 
                          alt={img.revised_prompt || `Generated image ${idx + 1}`}
                          style={{ 
                            width: '100%', 
                            maxWidth: '512px',
                            height: 'auto', 
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                          }}
                        />
                        {img.revised_prompt && (
                          <div style={{ 
                            fontSize: '0.85rem', 
                            color: '#666', 
                            marginTop: '6px',
                            fontStyle: 'italic'
                          }}>
                            <strong>Revised prompt:</strong> {img.revised_prompt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Display text response with markdown */}
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ node, ...props }) => (
                      <table style={{ borderCollapse: 'collapse', width: '100%' }} {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          backgroundColor: '#f2f2f2',
                          textAlign: 'left',
                        }}
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          textAlign: 'left',
                        }}
                        {...props}
                      />
                    ),
                    // Custom renderer for images in markdown to handle DALL-E images
                    img: ({ node, ...props }) => (
                      <img 
                        {...props}
                        style={{ 
                          maxWidth: '100%', 
                          height: 'auto', 
                          borderRadius: '8px',
                          margin: '8px 0'
                        }}
                      />
                    )
                  }}
                >
                  {fixMarkdownTables(
                    message.response.response
                      .replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, inner) => inner.trim())
                      .replace(/(?<!\n)\n(?!\n)/g, '  \n')
                      .replace(/```/g, '')
                  )}
                </Markdown>


              </div>
            </div>

            {/* Action Buttons - Exact implementation from ChatMessage.jsx */}
            {message?.response?.response && (
              <div className="d-flex align-items-center gap-3 ms-5 action-btn relative">
                <Copy
                  onClick={handleCopy}
                  size={15}
                  color="black"
                  className="cursor-pointer"
                />
                <Volume2
                  size={15}
                  className="cursor-pointer"
                  fill={isSpeaking ? null : "#fafafa"}
                  onClick={handleSpeak}
                />
                <Download
                  size={18}
                  color="black"
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => setIsOpen(!isOpen)}
                />
                <Share2
                  onClick={handleShare}
                  size={15}
                  color="black"
                  className="cursor-pointer"
                />
                <Pin
                  size={15}
                  color={loading ? "grey" : "black"}
                  style={{ fill: pin ? "black" : "none" }}
                  onClick={pin ? handleUnpin : handlePin}
                  className="cursor-pointer"
                />
                <LayoutTemplate
                  size={15}
                  className="cursor-pointer"
                  onClick={handleTemplateDownload}
                />
              </div>
            )}
          </>
        )}
      </div>
      
      <DownloadModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        message={message?.response?.response}
      />
    </>
  );
};

export default PublicChatMessage;
