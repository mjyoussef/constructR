import {Block, AddOn} from '../types/uiObjects';

export function beam(context: CanvasRenderingContext2D, info: Block): void {

    //temporarily save the context position and orientation
    context.save();

    context.fillStyle = info.color;

    //move to the coordinates of center of block, rotate, and fill in according to dims
    context.beginPath();
    context.translate(info.x, info.y);
    context.rotate(info.angle * (Math.PI/180));
    context.fillRect(-(info.width/2), -(info.height/2), info.width, info.height);

    const radius = info.height/8; //note that height is smaller than width

    //add a black dot in the center of the beam
    context.fillStyle="black";
    context.beginPath();
    context.arc(0, 0, radius, 0, 2*Math.PI);
    context.closePath();
    context.fill();

    //reposition the canvas to its original position + orientation
    context.restore();
}

export function displayAddOn(context: CanvasRenderingContext2D, info: AddOn): void {
    // save the context's position + orientation
    context.save();

    // display the addOn at its coordinate, rotate, and resize to dims
    context.translate(info.x, info.y);
    context.rotate(info.angle * (Math.PI/180));
    context.drawImage(info.image, -(info.width/2), -(info.height/2), info.width, info.height);
    
    // revert the context to its original position + orientation
    context.restore();
}