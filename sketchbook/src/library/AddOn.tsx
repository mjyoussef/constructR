import React, {useEffect, useRef} from 'react';
import {AddOn, AddOnInfo} from '../types/uiObjects';
import {beam, displayAddOn} from '../utilities/drawer';

type AddOnProps = {
    info: AddOnInfo,
    width: number,
    height: number
}

export function AddOn(props: AddOnProps) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvas: HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

            const addOn: AddOn = {
                label: props.info.label,
                image: props.info.image,
                x: canvas.width/2,
                y: canvas.height/2,
                width: canvas.width,
                height: canvas.height,
                angle: 0,
                type: "AddOn"
            }

            if (context !== null) {
                displayAddOn(context, addOn);
            }
        }
    });

    return (
        <canvas className={"m-2"} ref={canvasRef} width={window.innerWidth} height={window.innerHeight}/>
    )
}