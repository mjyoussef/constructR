import { maxHeaderSize } from 'http';
import React, {useEffect, useRef, Dispatch, SetStateAction} from 'react';
import {SketchCache} from '../types/cache';
import {AddOn, AddOnInfo} from '../types/uiObjects';
import {displayAddOn} from '../utilities/drawer';

type LibraryAddOnProps = {
    info: AddOnInfo,
    setCache: Dispatch<SetStateAction<SketchCache>>,
    restriction: number,
    x: number,
    y: number
}

function resizeFactorOf(image: HTMLImageElement, width: number, height: number): number {
    const widthResizeFactor = image.naturalWidth / width;
    const heightResizeFactor = image.naturalHeight / height;

    return Math.max(widthResizeFactor, heightResizeFactor);
}

export function LibraryAddOn(props: LibraryAddOnProps) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const canvas: HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

            const resizeFactor = resizeFactorOf(props.info.image, canvas.width, canvas.height);

            const addOn: AddOn = {
                label: props.info.label,
                image: props.info.image,
                x: canvas.width/2,
                y: canvas.height/2,
                width: (props.info.image.naturalWidth / resizeFactor),
                height: (props.info.image.naturalHeight / resizeFactor),
                angle: 0,
                type: "AddOn"
            }

            if (context !== null) {
                displayAddOn(context, addOn);
            }
        }
    });

    function addAddOnHandler() {
        const widthResizeFactor = (props.info.image.naturalWidth) / props.restriction;
        const heightResizeFactor = (props.info.image.naturalHeight) / props.restriction;

        const resizeFactor = resizeFactorOf(props.info.image, props.restriction, props.restriction);

        const newAddOn: AddOn = {
            label: props.info.label,
            image: props.info.image,
            x: props.x,
            y: props.y,
            width: (props.info.image.naturalWidth / resizeFactor),
            height: (props.info.image.naturalHeight / resizeFactor),
            angle: 0,
            type: "AddOn"
        }

        props.setCache(prevCache => {
            return prevCache.addAddOn(newAddOn);
        });
    }

    return (
        <>
            <div className={"self-center"}>
                <button
                    className={"self-center bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-full w-fit py-1 px-4"}
                    type={"button"}
                    onClick={addAddOnHandler}>
                    Add {props.info.label}
                </button>
            </div>
            <canvas className={"m-5"} ref={canvasRef} width={window.innerWidth} height={window.innerHeight}/>
        </>
    )
}