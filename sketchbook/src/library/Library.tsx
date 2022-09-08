import React, {useState, Dispatch, SetStateAction} from 'react';
import {Block, copyBlock} from '../types/uiObjects';
import {Beam} from './Beam';

type LibraryProps = {
    setBlocks: Dispatch<SetStateAction<Block[]>>
}

const defaultWidth = 800;
const defaultHeight = 50;
const defaultColor = "red";

export function Library(props: LibraryProps) {

    const [nextX, setNextX] = useState(0);
    const [nextY, setNextY] = useState(0);


    function addBlockHandler() {
        const newBlock: Block = {
            x: nextX,
            y: nextY,
            width: defaultWidth/4,
            height: defaultHeight/4,
            angle: 0,
            color: defaultColor
        }

        setNextX(nextX + 10);
        setNextY(nextY + 10);
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