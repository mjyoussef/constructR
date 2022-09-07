import React, {useEffect, useRef} from 'react';
import {Block} from '../types/uiObjects';
import {draw} from './drawer';

type BeamProps = {
    width: number,
    height: number,
    color: string
}

export function Beam(props: BeamProps) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvas : HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

            const displayBeam: Block = {
                x: canvas.width/2,
                y: 0,
                width: props.width,
                height: props.height,
                angle: 0,
                color: props.color
            }

            if (context !== null) {
                draw(context, displayBeam);
            }
        }
    });

    // adds a 10 pixel margin to the block
    return (
        <canvas className={"m-2"} ref={canvasRef} width={window.innerWidth} height={window.innerHeight}/>
    )
}