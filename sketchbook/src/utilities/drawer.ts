import {Block, AddOn} from '../types/uiObjects';

export function beam(context: CanvasRenderingContext2D, info: Block): void {
    //context.rotate(info.angle * (Math.PI/180));

    context.save();
    context.fillStyle = info.color;
    context.beginPath();
    context.translate(info.x, info.y);
    context.fillRect(-(info.width/2), -(info.height/2), info.width, info.height);

    const padding = info.width/60;
    const radius = info.height/8; 

    context.fillStyle="black";
    context.beginPath();
    context.arc(0, 0, radius, 0, 2*Math.PI);
    context.closePath();
    context.fill();
    
    context.fillStyle="white";
    //draw first circle in beam
    context.beginPath();
    context.arc((padding-(info.width/2)) + radius, 0, radius, 0, 2*Math.PI);
    context.closePath();
    context.fill();

    //draw second circle in beam
    context.beginPath();
    context.arc(((info.width/2)-padding) - radius, 0, radius, 0, 2*Math.PI);
    context.closePath();
    context.fill();

    context.restore();
}

export function displayAddOn(context: CanvasRenderingContext2D, info: AddOn): void {
    context.save();

    context.translate(info.x, info.y);
    context.rotate(info.angle * (Math.PI/180));
    context.drawImage(info.image, -(info.width/2), -(info.height/2), info.width, info.height);
    
    context.restore();
}