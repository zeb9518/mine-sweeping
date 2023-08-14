export interface BlockState {
  x: number
  y: number
  revealed: boolean //是否被点击
  mine?: boolean    //是否是地雷
  boom?: boolean    //是否被点击的地雷
  flag?: boolean    //是否被标记
  adjacentMines: number //周围地雷数量
}
