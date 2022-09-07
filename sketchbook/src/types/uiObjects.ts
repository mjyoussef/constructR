export type Block = {
   x: number,
   y: number,
   width: number,
   height: number,
   angle: number ,
   color: string
}

export function copyBlock(block: Block): Block {
   return {
      x: block.x,
      y: block.y,
      width: block.width,
      height: block.height,
      angle: block.angle,
      color: block.color
   }
}