import React, { useEffect, useRef } from "react";
import { RiArrowUpLine, RiAddLine } from "@remixicon/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat";
import { useSavePrompt } from "../hook/useSavePrompt";
import "../style/inputBar.scss";

const InputBar = () => {
  const inpRef = useRef(null);
  const { handleSendMessage } = useChat();
  const { handleClearSelectPrompt, handleSavePrompt } = useSavePrompt();

  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const selectPrompt = useSelector((state) => state.savePrompt.selectPrompt);

  const [chatInput, setchatInput] = useState("");
  const [showInputOptions, setShowInputOptions] = useState(false);

  useEffect(() => {
    if (selectPrompt) {
      setchatInput(selectPrompt); // Input fill
      handleClearSelectPrompt(); //clear Redux state & chatInput free to modify
    }
  }, [selectPrompt, handleClearSelectPrompt]);



  const handleSubmitMessage = (e) => {
    e.preventDefault();

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    handleSendMessage({
      message: trimmedMessage,
      chatId: currentChatId,
    });

    setchatInput("");

     if (inpRef.current) {
    inpRef.current.style.height = "auto"; 
    }
    
  };

  const handleChange = (e) => {
    setchatInput(e.target.value);

    const inp = inpRef.current;
    if(!inp) return 

    inp.style.height = "auto"; // reset
    inp.style.height = inp.scrollHeight + "px"; // grow

  };

  

  const inputOptionToggle = () => {
    setShowInputOptions(!showInputOptions);
  };

  const savePrompt = () => {
    // btn disable

    if (chatInput.trim().length > 0) {
      handleSavePrompt(chatInput);
    }

    setShowInputOptions(false);
  };

  return (
    <div className="inputBar">
      <form className="input-box" onSubmit={handleSubmitMessage}>
        <div className={`inputOption ${showInputOptions && "show"}`}>
          <div onClick={savePrompt}>save prompt</div>
        </div>

        <div className="sendIcon" onClick={inputOptionToggle}>
          <RiAddLine size={"1.4rem"} />
        </div>

        <textarea
          type="text"
          className="input"
          placeholder="Ask anything"
          value={chatInput}
          rows={1}
          ref={inpRef}
          onChange={handleChange}
       
        />

        <button className="sendIcon" disabled={!chatInput.trim()}>
          <RiArrowUpLine size={"1.5rem"} />
        </button>
      </form>
    </div>
  );
};

export default InputBar;
