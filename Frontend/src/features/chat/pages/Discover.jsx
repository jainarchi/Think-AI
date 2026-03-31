import React, { useEffect } from "react";
import {
  RiTerminalBoxLine,
  RiAddLine,
  RiCompass3Line,
  RiFlashlightLine,
  RiBookmark3Fill,
  RiDeleteBin6Line,
} from "@remixicon/react";
import "../style/discover.scss";

import { Power_Promts_Data } from "../utils/powerPromt.js";
import { useNavigate } from "react-router-dom";
import { useSavePrompt } from "../hook/useSavePrompt.js";
import { useSelector } from "react-redux";

const Discover = () => {
  const navigate = useNavigate();
  const { handleDeleteSavedPrompt, handleGetSavedPrompts , handleSelectPrompt } = useSavePrompt();

  const savedPrompts = useSelector((state) => state.savePrompt.savedPrompts);

  useEffect(() => {
    handleGetSavedPrompts();

  }, []);

  const onSelectPrompt = (prompt, withChat) => {
    handleSelectPrompt(prompt, withChat);
    navigate("/");
  };

  const formatCategory = (str) => {
    return str.replace(/([A-Z])/g, " $1").toUpperCase();
  };

  return (
    <div className="discover-container">
      <header className="explore-header">
        <div className="title-group">
          <RiCompass3Line size={32} className="header-icon" />
          <h1>Neural Discovery</h1>
        </div>
        <p className="subtitle">
          Select a specialized power-module to accelerate your workflow.
        </p>
      </header>

      <div className="userSaved">
        <h4 className="heading">PERSONAL VAULT</h4>

        <div className="saved-prompts-grid">
          {savedPrompts.length === 0 ? (
            <p className="no-saved">No saved prompt found.</p>
          ) : (
            savedPrompts.map((item) => (
              <div
                key={item.id}
                className="saved-card"
                onClick={() => onSelectPrompt(item.description, "current")}
              >
                <div className="card-header">
                  <div className="title-wrapper">
                    <RiBookmark3Fill size={14} className="bookmark-icon" />

                    <span className="card-title">your saved</span>
                  </div>
                  <RiDeleteBin6Line
                    size={16}
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSavedPrompt(item.id);
                    }}
                  />
                </div>
                <p className="card-desc">{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="discovery-grid">
        <h4 className="heading">POWER PROMPTS</h4>

        {Object.entries(Power_Promts_Data).map(([category, items]) => (
          <section key={category} className="module-section">
            <h4 className="module-label">
              <RiTerminalBoxLine size={14} className="label-icon" />
              {formatCategory(category)}
            </h4>

            <div className="module-grid">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="module-pill quick-pill"
                  onClick={() => onSelectPrompt(item.powerPrompt, "current")}
                >
                  <div className="pill-content">
                    <RiFlashlightLine size={14} className="pill-icon" />
                    <span>{item.title}</span>
                  </div>

                  <RiAddLine
                    size={18}
                    className="plus-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPrompt(item.powerPrompt, "new");
                    }}
                    title="Start in New Chat"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Discover;
