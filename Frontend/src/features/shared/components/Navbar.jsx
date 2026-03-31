import { RiMenuLine } from "@remixicon/react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "../style/navbar.scss";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();

  const chats = useSelector((state) => state.chat.chats);
  const chatId = useSelector((state) => state.chat.currentChatId);


  const displayTitle =
    location.pathname === "/" ? chats[chatId]?.title || "New Chat" : "";


    
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className={`${isSidebarOpen && "hide"}`}>
          <RiMenuLine
            size={"1.5rem"}
            className="nav-hamburger"
            onClick={() => setIsSidebarOpen(true)}
          />
        </span>

        <h3>Infra AI</h3>
      </div>

      <p className="nav-title">{displayTitle}</p>
    </nav>
  );
};

export default Navbar;
