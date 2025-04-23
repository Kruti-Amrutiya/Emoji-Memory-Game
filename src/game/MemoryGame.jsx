import DifficultyButtons from "./difficultyButton";
import useMemoryGameHook from "./hook/useMemoryGameHook";

const MemoryGame = () => {
  const [
    {
      moves,
      seconds,
      cards,
      flippedCards,
      matchedCards,
      cardCount,
      gameOver,
      timeLimit,
      difficulty,
    },
    { setDifficultyLevel, restartGame, flipCard },
  ] = useMemoryGameHook({});

  const isLocked = gameOver || matchedCards.length > 0;

  return (
    <div className="game-container">
      <h1>Emoji Memory Game</h1>
      <p>
        Moves: {moves} | Time: {timeLimit - seconds}s
      </p>

      <div className="difficulty-buttons">
        <DifficultyButtons
          currentDifficulty={difficulty}
          setDifficultyLevel={setDifficultyLevel}
          isLocked={isLocked}
        />
      </div>

      <div className="card-grid">
        {cards.map((emoji, index) => (
          <div
            key={index}
            className={`card ${
              flippedCards.includes(index) ||
              matchedCards.includes(cards[index])
                ? "flipped"
                : ""
            }`}
            onClick={() => flipCard(index)}
          >
            <div className="front">
              {flippedCards.includes(index) ||
              matchedCards.includes(cards[index])
                ? emoji
                : "❓"}
            </div>
            <div className="back" />
          </div>
        ))}
      </div>

      {gameOver && matchedCards.length < cardCount / 2 && (
        <div className="win-text" style={{ color: "red" }}>
          ⏰ Time's Up! Try Again!
        </div>
      )}

      {matchedCards.length === cardCount / 2 && (
        <div className="win-text">🎉 You Win! 🎉</div>
      )}

      <button className="restart-button" onClick={restartGame}>
        Shuffle and Restart
      </button>
    </div>
  );
};

export default MemoryGame;
