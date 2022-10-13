import {Dispatch, SetStateAction} from 'react';
import {CacheEntry, SketchCache} from '../types/cache';
import {SketchCanvas} from './SketchCanvas';

type PageProps = {
    cache: SketchCache,
    setCache: Dispatch<SetStateAction<SketchCache>>
}

export function Page(props: PageProps) {

    function updateFromCache(steps: number): void {
        let newIdx: number = props.cache.idx + steps;
        if (newIdx < 0) {
            newIdx = -1;
        }

        if (newIdx >= props.cache.cache.length) {
            newIdx = props.cache.cache.length-1;
        }
        
        props.setCache(prevCache => {
            return new SketchCache(prevCache.cache, newIdx);
        });
    }

    return (
        <div className={"flex flex-col w-full h-full"}>
            <div className={"flex flex-row-reverse mt-3 mx-6"}>
                <button
                    className={`bg-transparent hover:bg-red-500 text-red-500 font-bold
                        hover:text-white w-fit py-2 px-4 border border-red-500 hover:border-transparent rounded`}
                    type="button"
                    onClick={() => {
                        props.setCache(new SketchCache(new Array<CacheEntry>(), -1));
                    }}>
                    Clear Sketch
                </button>
                <div>
                    <img 
                        className={"object-scale-down w-12 mr-16 mt-3 p-2 hover:p-1"}
                        src={require("./images/forward_arrow.png")}
                        alt={"forward arrow"}
                        onClick={() => updateFromCache(1)} />
                </div>
                <div>
                    <img
                        className={"object-scale-down w-12 mr-2 mt-3 p-2 hover:p-1"}
                        src={require("./images/backward_arrow.png")}
                        alt={"backward arrow"}
                        onClick={() => updateFromCache(-1)} />
                </div>
            </div>
            <div>
                <SketchCanvas cache={props.cache} setCache={props.setCache}/>
            </div>
        </div>
    );
}