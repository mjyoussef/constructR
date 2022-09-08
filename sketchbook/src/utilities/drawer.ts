import {Block} from '../types/uiObjects';

export function beam(context: CanvasRenderingContext2D, info: Block): void {
    context.rotate(info.angle * (Math.PI/180));
    context.beginPath();
    context.fillStyle = info.color;
    context.fillRect(info.x, info.y, info.width, info.height);

    const padding = info.width/60;
    const radius = info.height/8; 
    context.fillStyle="white";
    
    //draw first circle in beam
    context.beginPath();
    context.arc(info.x + padding + radius, info.y + (info.height/2), radius, 0, 2*Math.PI);
    context.closePath();
    context.fill();

    //draw second circle in beam
    context.beginPath();
    context.arc(info.x + info.width - padding - radius, info.y + (info.height/2), radius, 0, 2*Math.PI);
    context.closePath();
    context.fill();

    context.setTransform(1, 0, 0, 1, 0, 0);
}