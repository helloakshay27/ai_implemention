import { Bot, Copy, Download, LayoutTemplate, Pin, Share2, User, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "react-hot-toast";
import axios from "axios";
import Markdown from "react-markdown";
import DownloadModal from "./Download";
import RemoveMarkdown from "remove-markdown";
import Presale from "../templates/presale";
import { marked } from "marked";

const ChatMessage = ({ message }) => {
  const [pin, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  const token = localStorage.getItem("access_token");
  const userEmail = sessionStorage.getItem("email");

  const handleShare = () => {
    if (!message || !userEmail) return;

    const subject = encodeURIComponent("Shared Message");
    const body = encodeURIComponent(
      message.content?.response || message.content
    );

    window.open(
      `mailto:${userEmail}?subject=${subject}&body=${body}`,
      "_blank"
    );
  };

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

    const raw = message.content?.response || message.content;
    const cleanText = RemoveMarkdown(raw);

    if (!voices.length) {
      toast.error("Voices not loaded yet");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.voice = voices[2];

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(message.content?.response || message.content)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy to clipboard");
      });
  };

  const handlePin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://ai-implementation.lockated.com/pin-message/?token=${token}`,
        {
          message: message.content?.response || message.content,
        }
      );

      if (response.data.success) {
        setPinned(true);
        toast.success("Pinned successfully");
      }
    } catch (error) {
      toast.error("Failed to pin message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  const parseOutline = (text) => {
    // Start from "1. " — trim intro
    const startIndex = text.search(/^\s*1\.\s+/m);
    if (startIndex === -1) return []; // fallback

    // Extract only the portion starting from "1."
    const trimmed = text.slice(startIndex);

    // Match all lines that look like bullet/numbered points or subpoints
    const lines = trimmed
      .split('\n')
      .filter(line => line.trim().match(/^(\s*[\*\-\d\.]+\s+)/)); // include only points

    const stack = [];
    const root = [];

    const getLevel = (line) => {
      const spaces = line.match(/^\s*/)[0].length;
      return Math.floor(spaces / 2); // tune if needed
    };

    for (const line of lines) {
      const level = getLevel(line);
      const title = line.replace(/^\s*[\*\-\d\.]+\s*/, '').trim();
      const node = { title, children: [], level };

      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].children.push(node);
      }

      stack.push(node);
    }

    const cleanLevels = (arr) =>
      arr.map(({ level, ...rest }) => ({
        ...rest,
        children: cleanLevels(rest.children || [])
      }));

    return cleanLevels(root);
  };



  const cleanOutline = (outline) => {
    return outline.map((item) => ({
      title: RemoveMarkdown(item.title),
      children: item.children ? cleanOutline(item.children) : []
    }));
  };

  const handleTemplateDownload = () => {
    const outline = parseOutline(message.content?.response || message.content)
    const cleaned = cleanOutline(outline)
    console.log(cleaned)

    const htmlString = renderToStaticMarkup(<Presale content={cleaned} />);

    const element = document.createElement("div");
    element.innerHTML = htmlString;

    import("html2pdf.js").then((html2pdf) => {
      html2pdf.default()
        .set({
          margin: 10,
          filename: "response.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    });
  };


  return (
    <>
      <div>
        <div
          key={message.id}
          className={`d-flex ${message.isUser ? "justify-content-end" : "justify-content-start"
            }`}
        >
          {!message.isUser && (
            <Bot className="me-2 mt-3 " style={{ color: 'grey' }} size={24} />
          )}
          <div
            className={`message px-3 py-2 ${message.isUser ? "user-message" : "bot-message"
              }`}
          >
            {!message.isUser ? (
              <Markdown>
                {typeof message.content === "string"
                  ? message.content
                  : message.content?.response || message.content?.warning || ""}
              </Markdown>
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>
                {message.content}
              </div>
            )}
          </div>
          {message.isUser && (
            <User className="ms-2 mt-3" style={{ color: 'grey' }} size={24} />

          )}
        </div>
        {!message.isUser && (
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
              style={{ fill: pin ? 'black' : 'none' }}
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
      </div>
      <DownloadModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        message={message.content?.response || message.content}
      />
    </>
  );
};

export default ChatMessage;
