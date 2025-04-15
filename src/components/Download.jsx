import { Document, Packer, Paragraph, TextRun } from 'docx';
import { useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';

const DownloadModal = ({ isOpen, setIsOpen, message }) => {
  const options = [
    { id: 0, label: ".pdf" },
    { id: 1, label: ".docx" }
  ];

  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setIsOpen]);

  const handleItemClick = (id) => {
    if (id === 0) {
      handlePDFDownload();
    } else {
      handleWordDownload();
    }
  };

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    const lines = message.split('\n');

    let y = 20;

    lines.forEach((line) => {
      if (y + 10 > pageHeight) {
        doc.addPage();
        y = 20;
      }

      // Check if line is a header
      if (line.startsWith('###')) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(line.replace(/###\s*/, ''), margin, y);
      }
      // Check if it's a bullet point
      else if (line.trim().startsWith('*')) {
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text('• ' + line.replace(/^\s*\*\s*/, ''), margin + 5, y);
      } else {
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(line, margin, y);
      }

      y += 10;
    });

    doc.save('bot-response.pdf');
    setIsOpen(false);
  };


  const handleWordDownload = async () => {
    const plainText = message;
    console.log(plainText);
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Bot: ', bold: true }),
                new TextRun(plainText),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bot-response.docx';
    link.click();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className='download-parent'
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 w-[20%] download"
        ref={modalRef}
      >
        <div className="space-y-2">
          {options.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              style={{fontSize:"15px"}}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
