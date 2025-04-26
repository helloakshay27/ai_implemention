import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { useLocation, useParams } from "react-router-dom";
import Header from "./components/Header";
import { useChatContext } from "./contexts/chatContext";

const Layout = ({ children }) => {
    const location = useLocation();
    const { id } = useParams()

    const { fetchConversations } = useChatContext()

    const noTier = location.pathname.includes('/tiers');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchConversations(id)
    }, [id])

    return (
        <>
            <div className="website-content">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main className={`${isSidebarOpen ? "main-full" : "main"}`}>
                    <Header noTier={noTier} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                    {children}
                </main>
            </div>
        </>
    );
};

export default Layout;
