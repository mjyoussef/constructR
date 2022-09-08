import React, {useState, useEffect, useRef} from 'react';
import { beam } from '../utilities/drawer';
import {Block} from '../types/uiObjects';

type SketchProps = {
    blocks: Array<Block>,
    setBlocks:  React.Dispatch<React.SetStateAction<Block[]>>
}

export function Sketch(props: SketchProps) {
    const canvasRef = useRef(null);
    const [highlighedBlock, setHighlightedBlock] = useState(null);

    function onClickHandler() {
    }

    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvas: HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context !== null) {
                for (let i=0; i<props.blocks.length; i++) {
                    beam(context, props.blocks[i])
                }
            }
        }
    });

    return (
        <canvas className={"m-2"} ref={canvasRef} width={window.innerWidth} height={window.innerHeight}/>
    )
}