import { useState, useEffect } from "react";

const CURRENT_CHAT_MODE_KEY = "current_chat_mode";
const CURRENT_CHAT_KEY = "current_chat";

const Topbar = () => {
  const data = [
    { id: 0, label: "Personal" },
    { id: 1, label: "Professional" },
    // { id: 2, label: "2.0", parentId: 1 }, // Sub-option under Professional
  ];

  const Chat_id = localStorage.getItem(CURRENT_CHAT_KEY);
  const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(data);
  const [selectedItem, setSelectedItem] = useState(0);

  const toggleDropdown = () => setOpen(!isOpen);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem(CURRENT_CHAT_MODE_KEY));
    let updated = [];
    if (existing) {
      updated = existing.filter((item) => item.id !== Chat_id);
    }

    updated.push({
      mode: selectedItem,
      id: Chat_id,
    });

    localStorage.setItem(CURRENT_CHAT_MODE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("modeChanged"));
  }, [selectedItem, Chat_id]);

  const handleItemClick = (id) => {
    setSelectedItem(id);
    toggleDropdown();
  };

  return (
    // <div className="w-100 text-white p-3 topbar ">
    //   <Menu
    //     className="d-md-none menu"
    //     size={50}
    //     onClick={() => setIsSidebarOpen(true)}
    //   />
    <div className="dropdown">
      <div className="dropdown-header " onClick={toggleDropdown}>
        {items.find((item) => item.id == selectedItem).label}
        <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}
          style={{ color: 'rgba(199, 32, 48, 1)' }}></i>
      </div>
      <div className={`dropdown-body ${isOpen && "open"}`}>
        {items.map((item) => (
          <div
            key={item.id}
            className="dropdown-item"
            onClick={() => handleItemClick(item.id)}
            style={{ paddingLeft: item.parentId ? "2.5rem" : "1rem" }}
          >
            <span
              className={`dropdown-item-dot ${item.id == selectedItem ? "selected" : ""
                }`}
            >
              •
            </span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
    // </div> 
  );
};
export default Topbar;