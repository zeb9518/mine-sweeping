import {Inter} from 'next/font/google'
import React, {useState, useEffect} from "react";
import {MineExplosion, MineFlag} from "@/components/Icon"
import {BlockState} from "@/types/types";
import {produce} from "immer"
import {useSpring, animated} from '@react-spring/web'

const inter = Inter({subsets: ['latin']})

enum GameStatus {
  READY = "准备",
  PLAY = "进行中",
  WIN = "胜利",
  LOST = "失败",
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
const mines = 10

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
  const [startTime, setStartTime] = useState<number>()// 游戏开始时间
  const [endTime, setEndTime] = useState<number>()// 游戏结束时间


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

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  // 展开周围的空白
  function revealAdjacent(block: BlockState) {
    if (block.adjacentMines) return
    setBoard(produce(draft => {
      getSiblings(block).forEach((s) => {
        if (!s.revealed) {
          if (!s.flag)
            draft[s.y][s.x].revealed = true
        }
      })
    }))
  }

  function getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height)
        return undefined
      return board[y2][x2]
    }).filter(Boolean) as BlockState[]
  }



  // 计算周围的地雷数量
  function calcAdjacentMines(board: BlockState[][], block: BlockState): number {
    let count = 0;
    directions.forEach(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) return;
      if (board[y2][x2].mine) count++;
    });
    return count;
  }

  // 处理左键点击
  function handleLeftClick(block: BlockState) {
    if (status === GameStatus.LOST) return
    if (status === GameStatus.READY) {
      setStatus(GameStatus.PLAY)
      if (!mineGenerated) {
        // 生成地雷
        generateMines(block);
        setMineGenerated(true)
      }
    }
    setBoard(produce(draft => {
      draft[block.y][block.x].revealed = true
    }))
    // 点击到地雷
    if (block.mine && !block.flag) {
      setStatus(GameStatus.LOST)
      return;
    }
    revealAdjacent(block)
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
      <div>
        <span>游戏状态:{status}</span>
      </div>
      <div className="flex justify-center mt-32">
        {
          board.map((row, x) =>
            <div key={x}>
              {
                row.map((block, y) =>
                  <button key={y}
                          className={`flex items-center justify-center w-10 h-10 border-2 hover:bg-sky-700 ${!block.revealed ? 'bg-white-700' : 'bg-gray-200'}`}
                          onClick={() => handleLeftClick(block)}
                          onContextMenu={(e) => handleRightClick(e, block)}>
                    {block.flag ? <MineFlag color={"red"}/> : null}
                    {!block.revealed ? null : block.mine ?
                      <MineExplosion color={"red"}/> : block.adjacentMines > 0 &&
                      <span className={numberColor[block.adjacentMines]}>{block.adjacentMines}</span>}
                  </button>
                )
              }
            </div>)
        }
      </div>
    </main>
  )
}

const numberColor = [
  'text-amber-500',
  'text-green-500',
  'text-red-500',
  'text-blue-500',
  'text-purple-500',
  'text-cyan-500',
]