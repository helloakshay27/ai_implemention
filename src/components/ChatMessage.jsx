import { Bot, Copy, Download, Pin, Share2, User, Volume2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useSpeechSynthesis } from "react-speech-kit";
import axios from 'axios';
import Markdown from 'react-markdown'
import DownloadModal from './Download';
import RemoveMarkdown from 'remove-markdown';

const ChatMessage = ({ message }) => {
  const [pin, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { speak, voices } = useSpeechSynthesis();

  const token = localStorage.getItem('access_token');
  const userEmail = sessionStorage.getItem('email');

  const handleShare = () => {
    if (!message || !userEmail) return;

    const subject = encodeURIComponent('Shared Message');
    const body = encodeURIComponent(message.content?.response || message.content);

    window.open(`mailto:${userEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleSpeak = () => {
    const raw = message.content?.response || message.content;
    const cleanText = RemoveMarkdown(raw);

    if (!voices.length) {
      toast.error("Voices not loaded yet");
      return;
    }
    console.log(voices)
    speak({
      text: cleanText,
      voice: voices[0]
    })
  }

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content?.response || message.content).then(() => {
      toast.success("Copied to clipboard");
    }).catch(err => {
      toast.error("Failed to copy to clipboard");
    })
  }
  const handlePin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`https://ai-implementation.lockated.com/pin-message/?token=${token}`, {
        message: message.content?.response || message.content,
      });

      if (response.data.success) {
        setPinned(true);
        toast.success("Pinned successfully");
      }
    } catch (error) {
      toast.error("Failed to pin message. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const handleUnpin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://ai-implementation.lockated.com/unpin-message/?token=${token}`,
        {
          message: message.content?.response || message.content,
        }
      );

      if (response.data.success) {
        setPinned(false);
        toast.success("Unpinned successfully");
      }
    } catch (error) {
      toast.error("Failed to unpin message. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div>
        <div
          key={message.id}
          className={`d-flex ${message.isUser
            ? "justify-content-end"
            : "justify-content-start"
            }`}
        >
          {!message.isUser && (
            <Bot className="me-2 mt-3 text-white" size={24} />
          )}
          <div
            className={`message px-3 py-2 ${message.isUser ? "user-message" : "bot-message"
              }`}
          >
            {!message.isUser ? (
              <Markdown>
                {
                  typeof message.content === 'string'
                    ? message.content
                    : message.content?.response || message.content?.warning || ''
                }
              </Markdown>

            ) : (
              message.content
            )}
          </div>
          {message.isUser && (
            <User className="ms-2 mt-3 text-primary" size={24} />
          )}
        </div>
        {
          !message.isUser && (
            <div className='d-flex align-items-center gap-3 ms-5 action-btn relative'>
              <Copy onClick={handleCopy} size={15} color='#fafafa' className='cursor-pointer' />
              <Volume2 size={15} color='#fafafa' className='cursor-pointer' onClick={handleSpeak} />
              <Download
                size={18}
                color="#fafafa"
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setIsOpen(true)}
              />



              <Share2 onClick={handleShare} size={15} color='#fafafa' className='cursor-pointer' />
              <Pin size={15} color={loading ? '#3e3e3e' : '#fafafa'} fill={pin ? '#fafafa' : null} onClick={pin ? handleUnpin : handlePin} className='cursor-pointer' />
            </div>
          )
        }
      </div>
      <DownloadModal isOpen={isOpen} setIsOpen={setIsOpen} message={message.content?.response || message.content} />
    </>
  );
};

export default ChatMessage