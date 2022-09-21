export type Block = {
   x: number,
   y: number,
   width: number,
   height: number,
   angle: number,
   color: string,
   type: "Block"
}

export type AddOn = {
   label: string,
   image: HTMLImageElement,
   x: number,
   y: number,
   width: number,
   height: number,
   angle: number,
   type: "AddOn"
}

export type Dimension = {
   width: number,
   height: number
}