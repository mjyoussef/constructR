import React, {useState, useEffect, useRef} from 'react';
import { beam } from '../utilities/drawer';
import {Block, AddOn} from '../types/uiObjects';
import {CacheEntry, SketchCache} from '../types/cache';

type SketchProps = {
    cache: SketchCache,
    setCache: React.Dispatch<React.SetStateAction<SketchCache>>
}

function distance(p1: {x: number, y: number}, p2: {x: number, y: number}) {
    const xDist: number = p1.x - p2.x;
    const yDist: number = p1.y - p2.y;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function findClosestItem(items: Array<Block | AddOn>, point: {x: number, y: number}): number {
    if (items.length === 0) {
        return -1;
    }

    let closest: number = 0;
    let minDist: number = Number.MAX_VALUE;

    for (let i=0; i<items.length; i++) {

        let dist: number = distance(point, {x: items[i].x, y: items[i].y});
        if (dist < minDist) {
            minDist = dist;
            closest = i;
        }
    }

    if (minDist <= (Math.min(items[closest].width, items[closest].height)/2) + 20) {
        return closest;
    }
    return -1;
}

function findBlockOnClick(blocks: Array<Block>, point: {x: number, y: number}):
    {blocksCopy: Array<Block>, closestBlock: Block | null} {

    const closestBlockIdx: number = findClosestItem(blocks, point);
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
    const [madeChange, setMadeChange] = useState(false);

    const [currentBlock, setCurrentBlock] = useState(-1);
    const [currentAddOn, setCurrentAddOn] = useState(-1);

    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    function handleClick(e: React.MouseEvent<HTMLCanvasElement>): void {

        //update the current block and addOn
        const closestBlockIdx: number = findClosestItem(blocks, {x: e.clientX, y: e.clientY});
        const closestAddOnIdx: number = findClosestItem(addOns, {x: e.clientX, y: e.clientY});

        if (closestBlockIdx === -1 && closestAddOnIdx === -1) {
            setCurrentBlock(-1);
            setCurrentAddOn(-1);
        } else if (closestBlockIdx === -1) {
            setCurrentBlock(-1);
            setCurrentAddOn(closestAddOnIdx);
        } else if (closestAddOnIdx === -1) {
            setCurrentBlock(closestBlockIdx);
            setCurrentAddOn(-1);
        } else {
            const selectedBlock: Block = blocks[closestBlockIdx];
            const selectedAddOn: AddOn = addOns[closestAddOnIdx];
            
            if (distance({x: e.clientX, y: e.clientY}, {x: selectedBlock.x, y: selectedBlock.y}) < distance({x: e.clientX, y: e.clientY}, {x: selectedAddOn.x, y: selectedAddOn.y})) {
                setCurrentBlock(closestBlockIdx);
                setCurrentAddOn(-1);
            } else {
                setCurrentBlock(-1);
                setCurrentAddOn(closestAddOnIdx);
            }
        }
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(true);
    }

    function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>): void {

        setMouseDown(false);

        props.setCache(prevCache => {
            if (!madeChange) {
                return prevCache;
            }

            setMadeChange(false);
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
                        setMadeChange(true);
                        selectedBlock.x = coords.x;
                        selectedBlock.y = coords.y;
                        return newBlocksObj.blocksCopy;
                    }
                    return prev;
                });
            }
        }
    }

    //updates the current set of blocks / addOns if they are 
    // added from the library
    useEffect(() => {
        if (!mouseDown) {
            setBlocks(getUpdatedBlocks());
            setAddOns(getUpdatedAddOns());
        }
    }, [props.cache]);

    // clears and displays blocks / addOns on sketch canvas at every rerender
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

                //add addOns to the canvas
                //
                //
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
            onClick={handleClick}
            />
    );
}