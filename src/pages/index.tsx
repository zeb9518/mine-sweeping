import React, { useState, useEffect } from "react";
import * as Icons from "@/components/Icons"
import { BlockState } from "@/types/types";
import { produce } from "immer"

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
  return Array.from({ length: col }, (_, y) =>
    Array.from({ length: row },
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
    ),
  )
}



const NUMBERS_MAP = new Map()
NUMBERS_MAP.set(1, <Icons.One />)
NUMBERS_MAP.set(2, <Icons.Two />)
NUMBERS_MAP.set(3, <Icons.Three />)
NUMBERS_MAP.set(4, <Icons.Four />)
NUMBERS_MAP.set(5, <Icons.Five />)
NUMBERS_MAP.set(6, <Icons.Six />)
NUMBERS_MAP.set(7, <Icons.Seven />)
NUMBERS_MAP.set(8, <Icons.Eight />)


const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

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
  function generateMines(board: BlockState[][], initial: BlockState) {
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

    // 更新数字
    function updateNumbers(board: BlockState[][]) {
      board.forEach((row) => {
        row.forEach((block) => {
          if (block.mine) return;
          block.adjacentMines = calcAdjacentMines(board, block);
        });
      });
    }

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
    return copyBoard
  }

  // 展示所有地雷
  function revealMines(board: BlockState[][]) {
    return board.map(row => row.map(block => {
      if (block.mine && !block.flag)
        block.revealed = true
      return block
    })
    )
  }

  // 展开块
  function revealBlock(board: BlockState[][], block: BlockState) {
    const copyBoard = JSON.parse(JSON.stringify(board));
    // 展开当前点击的块
    copyBoard[block.y][block.x].revealed = true

    // 点击到地雷
    if (block.mine && !block.flag) {
      copyBoard[block.y][block.x].boom = true // 爆炸
      setStatus(GameStatus.LOST)
      console.log('游戏结束', copyBoard)
      return revealMines(copyBoard);
    }
    // 点击到数字
    const revealAdjacent = (block: BlockState) => {
      if (block.adjacentMines) return
      const siblings = directions.map(([dx, dy]) => {
        const x2 = block.x + dx
        const y2 = block.y + dy
        if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height)
          return undefined
        return copyBoard[y2][x2]
      }).filter(Boolean) as BlockState[]

      siblings.forEach((s) => {
        if (!s.revealed) {
          if (!s.flag)
            copyBoard[s.y][s.x].revealed = true
          revealAdjacent(s)
        }
      })
    }
    revealAdjacent(block)
    return copyBoard
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
    let newBoard;
    if (status === GameStatus.READY && !mineGenerated) {
      newBoard = revealBlock(generateMines(board, block), block)
      setMineGenerated(true)
      setStatus(GameStatus.PLAY)
    } else {
      if (block.flag) return
      newBoard = revealBlock(board, block)
    }
    setBoard(newBoard)
  }

  // 处理右键点击
  function handleRightClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, block: BlockState) {
    e.preventDefault();
    if (status !== GameStatus.PLAY) {
      handleLeftClick(block)
      return
    }
    setBoard(produce(draft => {
      if (block.revealed) return
      draft[block.y][block.x].flag = !block.flag
    }))
  }

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen  ">
        <div className='mb-10'>
          <span>游戏状态:{status}</span>
        </div>
        <div className='board' onContextMenu={(e) => e.preventDefault()}>
          <div className={"flex warp"}>
            {
              board.map((row, x) =>
                <div key={x} className=''>
                  {
                    row.map((block, y) =>
                      <div className={`block   ${block.boom ? 'mind-boom' : ''}`} key={y}>
                        <button
                          className={`w-10 h-10 ${!block.revealed ? 'block-action' : 'block-revealed'}`}
                          onClick={() => handleLeftClick(block)}
                          onContextMenu={(e) => handleRightClick(e, block)}>
                          {block.flag ? <Icons.MineFlag /> : null}
                          {
                            !block.revealed ? null : block.mine ?
                              <Icons.Mine /> : block.adjacentMines > 0 &&
                              <span>{NUMBERS_MAP.get(block.adjacentMines)}</span>
                          }
                        </button>
                      </div>
                    )
                  }
                </div>)
            }
          </div>
        </div>
      </div>
    </main>
  )
}

