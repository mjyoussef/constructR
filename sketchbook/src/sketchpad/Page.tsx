import {useState, useEffect, useRef} from 'react';
import {Block, AddOn} from '../types/uiObjects';
import {SketchCanvas} from './SketchCanvas';


type PageProps = {
    blocks: Array<Block>,
    setBlocks:  React.Dispatch<React.SetStateAction<Block[]>>,
    addOns: Array<AddOn>,
    setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>
}

export function Page(props: PageProps) {
    const keysPressed = useRef(new Set<string>());
    const [cache, setCache] = useState(new Array<Array<Block>>(props.blocks));

    useEffect(() => {
        function keyDownHandler(e: KeyboardEvent): void {
            keysPressed.current.add(e.key);

            if ((keysPressed.current.has("Control") || keysPressed.current.has("Meta")) && keysPressed.current.has("z")) {
                let recentState: Array<Block> | null = null;
                if (cache.length >= 2) {
                    recentState = cache[cache.length-2];
                }

                if (recentState !== null) {
                    props.setBlocks(recentState);
                }

                setCache(prevCache => {
                    const newCache: Array<Array<Block>> = new Array(Math.max(0, prevCache.length-1));
                    for (let i=0; i<prevCache.length-1; i++) {
                        newCache[i] = prevCache[i];
                    }

                    return newCache;
                });
            }
        }

        function keyUpHandler(e: KeyboardEvent): void {
            keysPressed.current.delete(e.key);
        }

        window.addEventListener("keydown", keyDownHandler);
        window.addEventListener("keyup", keyUpHandler);

        return () => {
            window.removeEventListener("keydown", keyDownHandler);
            window.removeEventListener("keyup", keyUpHandler);
        }
    });

    return (
        <div className={"flex flex-col w-full h-full"}>
            <div className={"flex flex-row-reverse mt-3 mx-8"}>
                <button
                    className={`bg-transparent hover:bg-red-500 text-red-500 font-bold
                        hover:text-white w-fit py-2 px-4 border border-red-500 hover:border-transparent rounded`}
                    type="button"
                    onClick={() => {
                        props.setBlocks(new Array<Block>());
                        setCache(new Array<Array<Block>>());
                    }}>
                    Clear Sketch
                </button>
            </div>
            <div className={""}>
                <SketchCanvas blocks={props.blocks} setBlocks={props.setBlocks} setCache={setCache}/>
            </div>
        </div>
    )
}