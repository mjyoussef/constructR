import React, {useState, useEffect, useRef} from 'react';
import { beam } from '../utilities/drawer';
import {Block, AddOn} from '../types/uiObjects';
import {CacheEntry, SketchCache} from '../types/cache';

type SketchProps = {
    cache: SketchCache,
    setCache: React.Dispatch<React.SetStateAction<SketchCache>>
}

/**
 * Computes the Euclidean distance between two points
 * @param p1 a 2D coordinate
 * @param p2 a 2D coordinate
 * @returns returns a number
 */
function distance(p1: {x: number, y: number}, p2: {x: number, y: number}): number {
    const xDist: number = p1.x - p2.x;
    const yDist: number = p1.y - p2.y;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

/**
 * Finds the index of the item that is the closest to the provided point
 * @param items a list of blocks or add-ons
 * @param point a 2D coordinate
 * @returns index (-1 if the closest item is outside of the block)
 */
function findClosestItem(items: Array<Block> | Array<AddOn>, point: {x: number, y: number}): number {
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

    if (minDist <= (Math.min(items[closest].width/2, items[closest].height)/2) + 20) {
        return closest;
    }
    return -1;
}

/**
 * Returns the item that a provided coordinate is pointing to (returns the closest item if multiple items are being pointed to)
 * @param blocks an array of blocks
 * @param addOns an array of add-ons
 * @param point a 2D coordinate
 * @returns the closest block or add-on or null if no item is being pointed to
 */
function findSelectedItem(blocks: Array<Block>, addOns: Array<AddOn>, point: {x: number, y:number}): Block | AddOn | null {
    const blockIdx = findClosestItem(blocks, point);
    const addOnIdx = findClosestItem(addOns, point);

    if (blockIdx === -1 && addOnIdx === -1) {
        return null;
    } else if (blockIdx === -1) {
        return addOns[addOnIdx];
    } else if (addOnIdx === -1) {
        return blocks[blockIdx];
    } else {
        if (distance({x: blocks[blockIdx].x, y: blocks[blockIdx].y}, point) < distance({x: addOns[addOnIdx].x, y: addOns[addOnIdx].y}, point)) {
            return blocks[blockIdx];
        }
        return addOns[addOnIdx];
    }
}

/**
 * Returns the coordinates of a click event with respect to the dimensions of the canvas
 * @param x the global x coordinate
 * @param y the global y coordinate
 * @param canvasRef a reference to the canvas
 * @returns a 2D coordinate
 */
function getClickCoordinates(x: number, y: number, canvasRef: React.MutableRefObject<HTMLCanvasElement | null> ): 
                            {x: number, y: number} | null {
    if (canvasRef.current !== null) {
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context !== null) {
            // look for the block that is the closest to the mouse click
            let rec = canvas.getBoundingClientRect();

            // don't update state if the click is outside the canvas 
            if (x- rec.left < 0 || x - rec.right > 0 || 
                y - rec.top < 0 || y - rec.bottom > 0) {
                return null;
            }

            return {
                x: x - rec.left,
                y: y - rec.top
            }
        }
    }

    return null;
}

export function SketchCanvas(props: SketchProps) {
    const [mouseDown, setMouseDown] = useState(false);

    // Use the state of the blocks array and the add-ons array at the specified idx.
    // Once the user has finished repositioning blocks and/or add-ons (notified by mouse up event),
    // a new cache entry is added **** at `idx` ****

    /**
     * Returns a copy of the blocks at the current cache entry
     * @returns an array of blocks
     */
    function getUpdatedBlocks(): Array<Block> {
        return props.cache.getBlocks().map(block => {
            return {...block};
        });
    }

    /**
     * Returns a copy of the add-ons at the current cache entry
     * @returns an array of add-ons
     */
    function getUpdatedAddOns(): Array<AddOn> {
        return props.cache.getAddOns().map(addOn => {
            return {...addOn};
        });
    }

    const [entry, setEntry] = useState({blocks: getUpdatedBlocks(), addOns: getUpdatedAddOns()} as CacheEntry);
    const [madeChange, setMadeChange] = useState(false);

    const [currentBlock, setCurrentBlock] = useState(-1);
    const [currentAddOn, setCurrentAddOn] = useState(-1);

    const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);

    /**
     * Updates the currently selected block/add-on
     * @param e a mouse event (stores the coordinates of a click)
     * @returns NA
     */
    function handleClick(e: React.MouseEvent<HTMLCanvasElement>): void {

        //update the current block and addOn
        const coords: {x: number, y: number} | null = getClickCoordinates(e.clientX, e.clientY, canvasRef);
        let closestBlockIdx = -1;
        let closestAddOnIdx = -1;
        if (coords === null) {
            return;
        } else {
            closestBlockIdx = findClosestItem(entry.blocks, coords);
            closestAddOnIdx = findClosestItem(entry.addOns, coords);
        }

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
            const selectedBlock: Block = entry.blocks[closestBlockIdx];
            const selectedAddOn: AddOn = entry.addOns[closestAddOnIdx];
            
            if (distance({x: e.clientX, y: e.clientY}, {x: selectedBlock.x, y: selectedBlock.y}) < distance({x: e.clientX, y: e.clientY}, {x: selectedAddOn.x, y: selectedAddOn.y})) {
                setCurrentBlock(closestBlockIdx);
                setCurrentAddOn(-1);
            } else {
                setCurrentBlock(-1);
                setCurrentAddOn(closestAddOnIdx);
            }
        }
    }

    /**
     * Updates mouseDown to be true
     * @param e a mouse event
     */
    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(true);
    }

    /**
     * Updates mouseDown to be true and adds current entry to cache
     * @param e a mouse event
     */
    function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>): void {

        setMouseDown(false);

        props.setCache(prevCache => {
            if (!madeChange) {
                return prevCache;
            }

            setMadeChange(false);
            return prevCache.addEntry(entry);
        });
    }

    /**
     * Updates the cache with a new state of blocks/add-ons after an item has been moved
     * @param e a mouse event
     */
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

                setEntry(prevEntry => {
                    const updatedBlocks: Array<Block> = prevEntry.blocks.map(block => {
                        return {...block};
                    });
                    const updatedAddOns: Array<AddOn> = prevEntry.addOns.map(addOn => {
                        return {...addOn};
                    });

                    const selectedItem: Block | AddOn | null = findSelectedItem(updatedBlocks, updatedAddOns, coords);
                    if (selectedItem !== null) {
                        setMadeChange(true);
                        selectedItem.x = coords.x;
                        selectedItem.y = coords.y;

                        return {
                            blocks: updatedBlocks,
                            addOns: updatedAddOns
                        }
                    }

                    return prevEntry;
                });
            }
        }
    }

    // updates the current set of blocks / addOns if they are 
    // added from the library
    useEffect(() => {
        if (!mouseDown) {
            setEntry({
                blocks: getUpdatedBlocks(),
                addOns: getUpdatedAddOns()
            });
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

                for (let i=0; i<entry.blocks.length; i++) {
                    beam(context, entry.blocks[i]);
                }

                for (let i=0; i<entry.addOns.length; i++) {
                    // display the AddOn index i
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
            onClick={handleClick}
        />
    );
}