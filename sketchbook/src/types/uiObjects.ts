export type Block = {
   x: number,
   y: number,
   width: number,
   height: number,
   angle: number,
   color: string,
   type: string
}

export type AddOn = {
   label: string,
   image: HTMLImageElement,
   x: number,
   y: number,
   width: number,
   height: number,
   angle: number,
   type: string
}

export type AddOnInfo = {
   label: string,
   image: HTMLImageElement
}

export type Dimension = {
   width: number,
   height: number
}