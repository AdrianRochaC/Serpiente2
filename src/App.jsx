import React, { useState, useEffect, useRef, useCallback } from "react";

const box = 20;
const canvasSize = 400;
const initialSnake = [{ x: 10 * box, y: 10 * box }];
const initialDirection = "RIGHT";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(initialDirection);
  const [food, setFood] = useState(generateFood());
  const [gameRunning, setGameRunning] = useState(false);

  useEffect(() => {
    if (gameRunning) {
      const interval = setInterval(moveSnake, 100);
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameRunning]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleKeyDown(event) {
    const newDirection =
      event.key === "ArrowUp" && direction !== "DOWN"
        ? "UP"
        : event.key === "ArrowDown" && direction !== "UP"
        ? "DOWN"
        : event.key === "ArrowLeft" && direction !== "RIGHT"
        ? "LEFT"
        : event.key === "ArrowRight" && direction !== "LEFT"
        ? "RIGHT"
        : direction;
    setDirection(newDirection);
  }

  function generateFood() {
    return {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box,
    };
  }

  function moveSnake() {
    const newHead = { ...snake[0] };
    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    if (checkCollision(newHead)) {
      setGameRunning(false);
      alert("¡Game Over!");
      return;
    }

    const newSnake = [newHead, ...snake];
    if (newHead.x === food.x && newHead.y === food.y) {
      setFood(generateFood());
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  function checkCollision(head) {
    return (
      head.x < 0 ||
      head.x >= canvasSize ||
      head.y < 0 ||
      head.y >= canvasSize ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y)
    );
  }

  function startGame() {
    setSnake(initialSnake);
    setDirection(initialDirection);
    setFood(generateFood());
    setGameRunning(true);
  }

  function drawGame() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "lime";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, box, box);
    });
  }

  useEffect(() => {
    drawGame();
  }, [snake, food]);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
      <div className="controls">
        <button onClick={() => setDirection("UP")}>⬆️</button>
        <div>
          <button onClick={() => setDirection("LEFT")}>⬅️</button>
          <button onClick={() => setDirection("RIGHT")}>➡️</button>
        </div>
        <button onClick={() => setDirection("DOWN")}>⬇️</button>
      </div>
      <button onClick={startGame}>
        {gameRunning ? "Reiniciar" : "Iniciar"} Juego
      </button>
    </div>
  );
};

export default SnakeGame;
