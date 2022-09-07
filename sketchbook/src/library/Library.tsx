import React, {Dispatch, SetStateAction} from 'react';
import {Block, copyBlock} from '../types/uiObjects';
import {Beam} from './Beam';

type LibraryProps = {
    setBlocks: Dispatch<SetStateAction<Block[]>>;
    nextX: number,
    nextY: number
}

const defaultWidth = 50;
const defaultHeight = 600;
const defaultColor = "red";

export function Library(props: LibraryProps) {

    function addBlockHandler() {
        const newBlock: Block = {
            x: props.nextX,
            y: props.nextY,
            width: defaultWidth,
            height: defaultHeight,
            angle: 0,
            color: defaultColor
        }

        props.setBlocks(blocks => [...blocks, newBlock]);
    }

    return (
        <div className={"flex flex-col m-2"}>
            <button
                className={"self-center bg-cyan-500 hover:bg-cyan-300 text-white font-bold rounded-full w-fit py-1 px-4"}
                type="button"
                onClick={addBlockHandler}>
                Add beam
            </button>
            <Beam width={defaultWidth} height={defaultHeight} color={defaultColor}/>
        </div>
    )
}