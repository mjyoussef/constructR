import React, {useEffect, useRef} from 'react';
import {Block} from '../types/uiObjects';
import {beam} from '../utilities/drawer';

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

            const x = (canvas.width/2);
            const y = (canvas.height/5);

            const displayBeam: Block = {
                x: x,
                y: y,
                width: props.width,
                height: props.height,
                angle: 0,
                color: props.color,
                type: "Block"
            }

            if (context !== null) {
                beam(context, displayBeam);
            }
        }
    });

    // adds a 10 pixel margin to the block
    return (
        <canvas className={"m-2"} ref={canvasRef} width={window.innerWidth} height={window.innerHeight}/>
    )
}