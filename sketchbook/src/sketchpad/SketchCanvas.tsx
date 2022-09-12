import React, {useState, useEffect, useRef} from 'react';
import { beam } from '../utilities/drawer';
import {Block, AddOn} from '../types/uiObjects';
import {CacheEntry, SketchCache} from '../types/cache';

type SketchProps = {
    cache: SketchCache,
    setCache: React.Dispatch<React.SetStateAction<SketchCache>>
}

function findClosestBlock(blocks: Array<Block>, point: {x: number, y: number}): number {
    if (blocks.length === 0) {
        return -1;
    }

    let closest: number = 0;
    let minDist: number = Number.MAX_VALUE;

    for (let i=0; i<blocks.length; i++) {
        let xDist: number = point.x - blocks[i].x;
        let yDist: number = point.y - blocks[i].y;

        let dist: number = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
        if (dist < minDist) {
            minDist = dist;
            closest = i;
        }
    }

    if (minDist <= (Math.min(blocks[closest].width, blocks[closest].height)/2) + 20) {
        return closest;
    }
    return -1;
}

function findBlockOnClick(blocks: Array<Block>, point: {x: number, y: number}):
    {blocksCopy: Array<Block>, closestBlock: Block | null} {

    const closestBlockIdx: number = findClosestBlock(blocks, point);
    const newBlocks: Array<Block> = new Array(blocks.length);


    let closestBlock: Block | null = null;

    for (let i=0; i<blocks.length; i++) {

        // shallow copy
        newBlocks[i] = {
            ...blocks[i]
        };

        if (i === closestBlockIdx) {
            closestBlock = newBlocks[i];
        }
    }

    const output: {blocksCopy: Array<Block>, closestBlock: Block | null} = {
        blocksCopy: newBlocks,
        closestBlock: closestBlock
    }

    return output;
}

export function SketchCanvas(props: SketchProps) {
    const [mouseDown, setMouseDown] = useState(false);

    // Use the state of the blocks array and the add-ons array at the specified idx.
    // Once the user has finished repositioning blocks and/or add-ons (notified by mouse up event),
    // a new cache entry is added **** at `idx` ****

    function getUpdatedBlocks(): Array<Block> {
        return props.cache.getBlocks().map(block => {
            return {...block};
        });
    }

    function getUpdatedAddOns(): Array<AddOn> {
        return props.cache.getAddOns().map(addOn => {
            return {...addOn};
        });
    }

    const [blocks, setBlocks] = useState(getUpdatedBlocks());
    const [addOns, setAddOns] = useState(getUpdatedAddOns());

    const [currentBlock, setCurrentBlock] = useState(null);
    const [currentAddOn, setCurrentAddOn] = useState(null);

    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(true);

        //update the current block and addOn

    }

    function handleMouseUp(): void {
        setMouseDown(false);
        props.setCache(prevCache => {
            const newEntry : CacheEntry = {
                blocks: blocks,
                addOns: addOns
            }

            return prevCache.addEntry(newEntry);
        });
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>): void {
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

                setBlocks(prev => {
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

    useEffect(() => {
        if (!mouseDown) {
            setBlocks(getUpdatedBlocks());
            setAddOns(getUpdatedAddOns());
        }
    }, [props.cache]);

    // clears and displays blocks on sketch canvas at every rerender
    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvas: HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context !== null) {
                //clear the canvas before displaying components
                context.clearRect(0, 0, canvas.width, canvas.height);

                for (let i=0; i<blocks.length; i++) {
                    beam(context, blocks[i]);
                }
            }
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