import {Block} from '../types/uiObjects';

export function draw(context: CanvasRenderingContext2D, info: Block): void {
    context.rotate(info.angle * (Math.PI/180));
    context.beginPath();
    context.fillRect(info.x, info.y, info.width, info.height);
    context.fillStyle = info.color;
    context.setTransform(1, 0, 0, 1, 0, 0);
}