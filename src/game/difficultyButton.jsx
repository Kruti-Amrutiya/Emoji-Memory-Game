import React from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";

const DifficultyButtons = ({
  currentDifficulty,
  setDifficultyLevel,
  isLocked,
}) => {
  const levels = ["Easy", "Medium", "Hard"];

  return (
    <div className="difficulty-buttons">
      {levels.map((level) => {
        const isSelected = currentDifficulty === level;
        return (
          <button
            key={level}
            onClick={() => !isLocked && setDifficultyLevel(level)}
            disabled={isLocked}
            className={`difficulty-btn ${isSelected ? "selected" : ""} ${
              isLocked ? "locked" : ""
            }`}
          >
            {isLocked && <LockClosedIcon className="lock-icon" />}
            <span>{level}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DifficultyButtons;
