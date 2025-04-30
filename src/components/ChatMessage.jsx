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
import axios from "axios";
import Markdown from "react-markdown";
import DownloadModal from "./Download";
import RemoveMarkdown from "remove-markdown";
import Presale from "../templates/presale";
import remarkGfm from 'remark-gfm';


const ChatMessage = ({ message }) => {
  const { id } = useParams();
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

    const raw = message?.response?.response;
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
      .writeText(message?.response?.response)
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
          message: message?.response?.response,
          conversation_token: id,
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
          message: message?.response?.response,
          conversation_token: id,
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

  const parseOutline = (text, startMarker = null) => {
    const lines = text
      .split("\n")
      .map((line) => line.replace(/\r$/, ""))
      .filter((line) => line.trim());

    if (!lines.length) return [];

    const listItemPattern = /^([*\-•]|\d+\.|[\w]\.|[\w]\)|\d+(\.\d+)+)\s+[^ \t]/;

    let firstListItemIndex = -1;
    let lastListItemIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().match(listItemPattern)) {
        if (firstListItemIndex === -1) {
          firstListItemIndex = i;
        }
        lastListItemIndex = i;
      }
    }

    if (firstListItemIndex === -1 || lastListItemIndex === -1) return [];

    let startIndex = firstListItemIndex;
    if (startMarker) {
      const regex = new RegExp(`^\\s*${startMarker.replace(/\./g, "\\.")}\\s+[^ \\t]`, "m");
      startIndex = lines.findIndex(
        (line, index) => index >= firstListItemIndex && line.match(regex)
      );
      if (startIndex === -1 || startIndex > lastListItemIndex) return [];
    }

    const relevantLines = lines.slice(startIndex, lastListItemIndex + 1);

    const stack = [];
    const root = [];

    const getLevel = (line) => {
      const spaces = line.match(/^\s*/)[0].length;
      return Math.floor(spaces / 2);
    };

    let lastListItem = null;

    for (const line of relevantLines) {
      const level = getLevel(line);
      const isListItem = line.trim().match(listItemPattern);
      const isFeatureOrStory = line.trim().match(/^(Feature:|User Story:)\s*[^ \t]/);
      const title = isListItem
        ? line.replace(/^\s*([*\-•]|\d+\.|[\w]\.|[\w]\)|\d+(\.\d+)+)\s*/, "").trim()
        : line.trim();

      let effectiveLevel = level;
      if (isFeatureOrStory && lastListItem && level <= lastListItem.level) {
        effectiveLevel = lastListItem.level + 1;
      }

      const node = { title, children: [], level: effectiveLevel };

      while (stack.length && stack[stack.length - 1].level >= effectiveLevel) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].children.push(node);
      }

      stack.push(node);

      if (isListItem) {
        lastListItem = node;
      }
    }

    const cleanLevels = (arr) =>
      arr.map(({ level, ...rest }) => ({
        ...rest,
        children: cleanLevels(rest.children || []),
      }));

    return cleanLevels(root);
  };

  const cleanOutline = (outline) => {
    return outline.map((item) => ({
      title: RemoveMarkdown(item.title),
      children: item.children ? cleanOutline(item.children) : [],
    }));
  };

  const handleTemplateDownload = () => {
    const outline = parseOutline(message.response.response);
    const cleaned = cleanOutline(outline);

    const htmlString = renderToStaticMarkup(<Presale content={cleaned} />);

    const element = document.createElement("div");
    element.innerHTML = htmlString;

    import("html2pdf.js").then((html2pdf) => {
      html2pdf
        .default()
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

  const fixMarkdownTables = (markdown) => {
    return markdown.replace(
      /(\|[^|\n]+\|[^|\n]+(?:\|[^|\n]+)*\|?)\n(?=\|[^-])/g,
      (match, headerRow) => {
        const colCount = (headerRow.match(/\|/g) || []).length - 1;
        const separator = '|' + ' --- |'.repeat(colCount);
        return `${headerRow}\n${separator}\n`;
      }
    );
  };

  return (
    <>
      <div>
        <div className="d-flex align-items-start justify-content-end">
          <div
            className={`message px-3 py-2 user-message d-flex align-items-center`}
          >
            <div style={{ whiteSpace: "pre-wrap" }}>
              {message?.query?.user_prompt}
            </div>
          </div>
          <User className="ms-2 mt-3" style={{ color: "grey" }} size={24} />
        </div>
        <div className="d-flex align-items-start justify-content-start">
          <Bot className="me-2 mt-3 " style={{ color: "grey" }} size={24} />
          {message?.response?.response ? (
            <div
              className={`message px-3 py-2 bot-message  align-items-center`}
            >
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
                  )
                }}
              >
                {
                  fixMarkdownTables(
                    message.response.response
                      .replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, inner) => inner.trim())
                      .replace(/(?<!\n)\n(?!\n)/g, '  \n')
                      .replace(/```/g, '')
                  )
                }
              </Markdown>
            </div>
          ) : (
            <div className="bot-thinking" style={{ minHeight: "30px" }} />
          )}
        </div>
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
      </div>
      <DownloadModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        message={message?.response?.response}
      />
    </>
  );
};

export default ChatMessage;
