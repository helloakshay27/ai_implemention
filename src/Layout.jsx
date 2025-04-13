import { useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="website-content">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <main className="main">
                {children}
            </main>
        </div>
    );
};

export default Layout;
