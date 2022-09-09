import React, {useState, useEffect, useRef} from 'react';
import { beam } from '../canvasUtilities/drawer';
import {Block, copyBlock} from '../types/uiObjects';

type SketchProps = {
    blocks: Array<Block>,
    setBlocks:  React.Dispatch<React.SetStateAction<Block[]>>
}

function findBlockOnClick(blocks: Array<Block>, point: {x: number, y: number}):
    {blocksCopy: Array<Block>, closestBlock: Block | null} {

    let newBlocks: Array<Block> = new Array(blocks.length);

    let closestBlock = null;
    let minDist: number = Number.MAX_VALUE;

    for (let i=0; i<blocks.length; i++) {
        newBlocks[i] = copyBlock(blocks[i]);

        let xDist: number = point.x - newBlocks[i].x;
        let yDist: number = point.y - newBlocks[i].y;

        let dist: number = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        if (dist < minDist) {
            minDist = dist;
            closestBlock = newBlocks[i];
        }
    }

    const output: {blocksCopy: Array<Block>, closestBlock: Block | null} = {
        blocksCopy: newBlocks,
        closestBlock: null
    }

    if (closestBlock !== null) {
        if (minDist <= (Math.min(closestBlock.width, closestBlock.height)/2) + 20) {
            output.closestBlock = closestBlock;
        }
    }

    return output;
}

export function Sketch(props: SketchProps) {
    let keysPressed: Set<String> = new Set();
    const [cache, setCache] = useState(new Array<Array<Block>>(props.blocks));
    const [mouseDown, setMouseDown] = useState(false);

    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(true);
        console.log("mouse DOWN");
    }

    function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(false);
        setCache(prevCache => [...prevCache, props.blocks]);
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>): void {
        console.log(mouseDown);
        if (!mouseDown) {
            return;
        }

        if (canvasRef.current !== null) {
            const canvas: HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context !== null) {
                // look for the block that is the closest to the mouse click
                let rec = canvas.getBoundingClientRect();

                // don't update state if the click is outside the canvas 
                if (e.clientX - rec.left < 0 || e.clientX - rec.right > 0 || 
                    e.clientY - rec.top < 0 || e.clientY - rec.bottom > 0) {
                    return;
                }

                let coords: {x: number, y: number} = {
                    x: e.clientX - rec.left,
                    y: e.clientY - rec.top
                }

                props.setBlocks(prev => {
                    const newBlocksObj = findBlockOnClick(prev, coords);
                    const selectedBlock = newBlocksObj.closestBlock;

                    if (selectedBlock !== null) {
                        selectedBlock.x = coords.x;
                        selectedBlock.y = coords.y;
                        return newBlocksObj.blocksCopy;
                    }
                    return prev;
                });
            }
        }
    }

    // clears and displays blocks on sketch canvas at every rerender
    useEffect(() => {
        console.log(cache);
        function keyDownHandler(e: KeyboardEvent): void {
            console.log(e.key);
            keysPressed.add(e.key);
            console.log(keysPressed);
            if ((keysPressed.has("Control") || keysPressed.has("Meta")) && keysPressed.has("z")) {
                let recentState: Array<Block> | null = null;
                if (cache.length >= 2) {
                    recentState = cache[cache.length-2];
                }

                if (recentState !== null) {
                    props.setBlocks(recentState);
                }

                setCache(prevCache => {
                    const newCache: Array<Array<Block>> = new Array(Math.max(0, prevCache.length-1));
                    for (let i=0; i<prevCache.length-1; i++) {
                        newCache[i] = prevCache[i];
                    }

                    return newCache;
                });
            }
        }

        function keyUpHandler(e: KeyboardEvent): void {
            keysPressed.delete(e.key);
        }

        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);

        if (canvasRef.current !== null) {
            const canvas: HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context !== null) {
                //clear the canvas before displaying components
                context.clearRect(0, 0, canvas.width, canvas.height);

                for (let i=0; i<props.blocks.length; i++) {
                    beam(context, props.blocks[i]);
                }
            }
        }
        
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
            window.removeEventListener("keyup", keyUpHandler);
        }
    });

    return (
        <canvas 
            className={"m-2"}
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            />
    );
}