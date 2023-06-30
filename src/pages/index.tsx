import {Inter} from 'next/font/google'
import React, {useState, useEffect} from "react";
import {MineExplosion, MineFlag} from "@/components/Icon"
import {BlockState} from "@/types/types";
import {produce} from "immer"

const inter = Inter({subsets: ['latin']})

enum GameStatus {
  READY,
  PLAY,
  WIN,
  LOST
}

// 随机范围
function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

// 随机整数
function randomInt(min: number, max: number) {
  return Math.round(randomRange(min, max))
}


// 游戏设置
const width = 10
const height = 10
const mines = 5

// 初始化棋盘
function initBoard(row: number, col: number) {
  return Array.from({length: col}, (_, y) =>
    Array.from({length: row},
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
    ),
  )
}


export default function Game() {

  const [status, setStatus] = useState<GameStatus>(GameStatus.READY)// 游戏状态
  const [board, setBoard] = useState<BlockState[][]>([])// 棋盘
  const [mineGenerated, setMineGenerated] = useState<boolean>(false)// 地雷是否已经生成

  useEffect(() => {
    const board = initBoard(width, height)
    setStatus(GameStatus.READY)
    setBoard(board)
  }, [])

  // 生成地雷
  function generateMines(initial: BlockState) {
    const copyBoard = JSON.parse(JSON.stringify(board));

    const placeRandom = () => {
      const x = randomInt(0, width - 1);
      const y = randomInt(0, height - 1);
      const block = copyBoard[y][x];
      if (Math.abs(initial.x - block.x) <= 1 && Math.abs(initial.y - block.y) <= 1)
        return false;
      if (block.mine) return false;
      block.mine = true;
      return true;
    };

    for (let i = 0; i < mines; i++) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = width * height;

      while (!placed && attempts < maxAttempts) {
        placed = placeRandom();
        attempts++;
      }

      updateNumbers(copyBoard);
    }

    setBoard(copyBoard);
  }

  // 更新数字
  function updateNumbers(board: BlockState[][]) {
    board.forEach((row) => {
      row.forEach((block) => {
        if (block.mine) return;
        block.adjacentMines = calcAdjacentMines(board, block);
      });
    });
  }

  // 计算周围的地雷数量
  function calcAdjacentMines(board: BlockState[][], block: BlockState): number {
    let count = 0;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) return;
      if (board[y2][x2].mine) count++;
    });

    return count;
  }


  // 游戏开始
  function startGame(block: BlockState) {
    setStatus(GameStatus.PLAY)
    // 生成地雷
    if (!mineGenerated) {
      generateMines(block);
      setMineGenerated(true)
    }
  }

  // 处理左键点击
  function handleLeftClick(block: BlockState) {
    console.log('handleLeftClick', block, status)
    if (status === GameStatus.READY)
      startGame(block) //开始游戏
    else if (status === GameStatus.PLAY && !block.flag) {
      if (block.mine)
        setStatus(GameStatus.LOST)
      else {
        setBoard(produce(draft => {
          draft[block.y][block.x].revealed = true
        }))
      }
    }
  }

  // 处理右键点击
  function handleRightClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, block: BlockState) {
    e.preventDefault();
    if (status !== GameStatus.PLAY) return
    setBoard(produce(draft => {
      draft[block.y][block.x].flag = !block.flag
    }))
  }


  return (
    <main>
      <div className="flex justify-center mt-32">
        {
          board.map((row, x) =>
            <div key={x}>
              {
                row.map((block, y) =>
                  <button key={y}
                          className="flex items-center justify-center w-10 h-10 border-2 hover:bg-sky-700"
                          onClick={() => handleLeftClick(block)}
                          onContextMenu={(e) => handleRightClick(e, block)}>
                    {block.mine ? <MineExplosion color={"red"}/> : null}
                    {block.flag ? <MineFlag color={"red"}/> : null}
                    {block.revealed ? block.adjacentMines : null}
                  </button>
                )
              }
            </div>)
        }

      </div>
      <span>
        游戏状态{status}
      </span>
    </main>
  )
}
