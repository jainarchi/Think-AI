import React, { useEffect, useState } from "react";
import {
  RiUser3Line,
  RiLogoutCircleRLine,
  RiMenuLine,
  RiEditBoxLine,
  RiFlashlightLine,
  RiMore2Line,
  RiPencilLine,
  RiDeleteBin7Line,
  RiMailLine,
} from "@remixicon/react";

import "../style/sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useChat } from "../../../features/chat/hook/useChat.js";
import { useAuth } from "../../../features/auth/hook/useAuth.js";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [showOptions, setShowOptions] = useState(null);
  const [showProfileInfo, setShowProfileInfo] = useState(false)

  console.log(showProfileInfo)

  const [title, setTitle] = useState("");
  const [titleChatId, setTitleChatId] = useState(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);

  const {
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleEditTitle,
    handleNewChat,
  } = useChat();

  const { handleLogout } = useAuth();

  useEffect(() => {
    handleGetChats();
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dot-icon")) {
        setShowOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renameTitle = async (chatId, newTitle) => {
    if (newTitle.trim().length === 0) return;
    await handleEditTitle(chatId, newTitle);
  };

  const deleteChat = async (chatId) => {
    try {
      await handleDeleteChat(chatId);
    } catch (err) {
      console.log(err);
    }
  };

  const openChat = (chatId) => {
    handleOpenChat(chatId, chats);
    navigate("/");
  }

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  }


  const logoutUser = async () => {
    console.log("logout user called");
    await handleLogout();
  };

  if (!chats) return <div>loading...</div>;

  return (
    <>
      <div className={` ${isSidebarOpen ? "sidebar" : "main-sidebar-close"}`}>
        <div className="top">
          <div className="options">

            <div className="menu-div">
              <RiMenuLine
                size={"1.2rem"}
                className="hamburger"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              />
            </div>

            <Link to="/" className="flex"
             onClick={() => {handleNewChat() , closeSidebarOnMobile()}}>

              <RiEditBoxLine size={"1.1rem"} className="icon" />
              New chat
            </Link>

            <Link className="flex" to="/discover" onClick={closeSidebarOnMobile}>
              <RiFlashlightLine size={"1.1rem"} className="icon" />
              Discover
            </Link>
          </div>

          <div className="allChats">
            <h5>Chats</h5>

            <div className="chat-titles">
              {Object.values(chats).map((chat) => (
                <div
                  className="flex chat-title"
                  onClick={() =>{ openChat(chat.id) , closeSidebarOnMobile()}}
                  key={chat.id}
                >
                  <span className="title">
                    {titleChatId === chat.id ? (
                      <input
                        className="editTitleInput"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => {
                          if (chat.title !== title) {
                            renameTitle(chat.id, title);
                          }
                          setTitleChatId(null);
                          setTitle("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (chat.title !== title) {
                              renameTitle(chat.id, title);
                            }
                            setTitleChatId(null);
                            setTitle("");
                          }
                        }}
                      />
                    ) : (
                      chat.title
                    )}
                  </span>

                  <div className="dot-icon">
                    <RiMore2Line
                      size={"1rem"}
                      className="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(
                          showOptions === chat.id ? null : chat.id,
                        );
                      }}
                    />

                    <div
                      className={`chat-option ${
                        showOptions === chat.id ? "show" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setTitleChatId(chat.id);
                          setTitle(chat.title);
                        }}
                      >
                        <RiPencilLine size={"18px"} /> rename
                      </div>

                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                      >
                        <RiDeleteBin7Line size={"18px"} /> delete
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div
            className={`profileDetails ${showProfileInfo && "display-block"}`}  
          >
            <div className="profileInfo" onClick={logoutUser}>
              <div className="logout-icon">
                <RiMailLine size={"16px"} />
              </div>
              {user.email}
            </div>
            <div className="profileInfo" onClick={logoutUser}>
              <div className="logout-icon">
                <RiLogoutCircleRLine size={"16px"} />
              </div>
              logout
            </div>
          </div>

          <div className="profileInfo"
            onClick={() => setShowProfileInfo(!showProfileInfo)}>
            <div className="profile-icon">
              <RiUser3Line size={"18px"} />
            </div>
            {user?.username}
          </div>
        </div>
      </div>

      {/* desktop mini sidebar */}

      <div
        className={` desptop-sidebar-close-view ${!isSidebarOpen && "static"}`}
      >
        <div className="options">
          <div className="menu-div">
            <RiMenuLine
              size={"1.36rem"}
              className="hamburger"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            />
          </div>

          <Link onClick={handleNewChat} to="/">
            <RiEditBoxLine size={"1.36rem"} className="icon" />
          </Link>

          <Link to="/discover">
            <RiFlashlightLine size={"1.36rem"} className="icon" />
          </Link>
        </div>



        <div className="sidebar-footer">


          <div
            className={`profileDetails ${showProfileInfo && "display-block"}`}
           
          >
            <div className="profileInfo" onClick={logoutUser}>
              <div className="logout-icon">
                <RiMailLine size={"16px"} />
              </div>
              {user.email}
            </div>
            <div className="profileInfo" onClick={logoutUser}>
              <div className="logout-icon">
                <RiLogoutCircleRLine size={"16px"} />
              </div>
              logout
            </div>
          </div>


          <div className="profile-icon"
           onClick={() => setShowProfileInfo(!showProfileInfo)}>
            <RiUser3Line size={"1.36rem"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
