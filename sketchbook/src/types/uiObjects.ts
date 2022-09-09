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

export type Dimension = {
   width: number,
   height: number
}

export type AddOn = {
   label: string,
   image: HTMLImageElement
}