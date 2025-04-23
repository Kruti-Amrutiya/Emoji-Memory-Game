import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

const useMemoryGameHook = () => {
  // Emoji list for the game
  const emojis = [
    "😊",
    "😎",
    "🐱",
    "🍕",
    "🌟",
    "💡",
    "🔥",
    "🎮",
    "🌈",
    "🐶",
    "🍓",
    "🍎",
    "🚀",
    "🏀",
    "⚽",
    "🎵",
    "🎨",
    "🎤",
    "🧸",
    "🦄",
    "🍔",
    "🥨",
    "🍿",
    "🍩",
    "🍪",
    "🥳",
    "🎁",
    "🌺",
    "🍉",
    "💎",
    "🎯",
    "🎲",
  ];

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");
  const [cardCount, setCardCount] = useState(8);
  const [timeLimit] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  // Sound effects
  const flipSound = new Audio("/sounds/flip-sound.mp3");
  const matchSound = new Audio("/sounds/match-sound.mp3");
  const mismatchSound = new Audio("/sounds/error-sound.mp3");

  // Set up game when difficulty changes
  useEffect(() => {
    const shuffled = shuffle([
      ...emojis.slice(0, cardCount / 2),
      ...emojis.slice(0, cardCount / 2),
    ]);
    setCards(shuffled);
  }, [cardCount]);

  // Shuffle function
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Update difficulty level
  const setDifficultyLevel = (level) => {
    if (gameOver) return;
    if (matchedCards.length > 0) return;
    setDifficulty(level);
    if (level === "Easy") setCardCount(8);
    if (level === "Medium") setCardCount(18);
    if (level === "Hard") setCardCount(32);
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (timerRunning && matchedCards.length < cardCount / 2 && !gameOver) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev + 1 >= timeLimit) {
            clearInterval(interval);
            setGameOver(true);
            setTimerRunning(false);
            return timeLimit;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (matchedCards.length === cardCount / 2) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, matchedCards, cardCount, gameOver, timeLimit]);

  // Handle card flip
  const flipCard = (index) => {
    flipSound.play();
    if (gameOver || flippedCards.length === 2 || flippedCards.includes(index))
      return;
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setTimerRunning(true);
      checkMatch(newFlipped);
    }
  };

  // Check for card match
  const checkMatch = (flipped) => {
    const [firstIndex, secondIndex] = flipped;
    if (cards[firstIndex] === cards[secondIndex]) {
      matchSound.play();
      setMatchedCards((prev) => [...prev, cards[firstIndex]]);
      setFlippedCards([]);
    } else {
      mismatchSound.play();
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  // Handle game restart
  const restartGame = () => {
    setDifficultyLevel("Easy");
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setSeconds(0);
    setTimerRunning(false);
    setGameOver(false);
  };

  const handleWin = () => {
    confetti();
  };

  // Check if player has won
  useEffect(() => {
    if (matchedCards.length === cardCount / 2) {
      handleWin();
      setGameOver(true);
    }
  }, [matchedCards]);

  return [
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
    { restartGame, flipCard, setDifficultyLevel },
  ];
};

export default useMemoryGameHook;
