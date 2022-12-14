import {useState, Dispatch, SetStateAction} from 'react';
import {Block, AddOnInfo} from '../types/uiObjects';
import {SketchCache} from '../types/cache';
import {Beam} from './Beam';
import {LibraryAddOn} from './LibraryAddOn';

type LibraryProps = {
    setCache: Dispatch<SetStateAction<SketchCache>>,
    setPopupTrigger: Dispatch<SetStateAction<boolean>>,
    addOnInfo: Array<AddOnInfo>,
    setAddOnInfo: Dispatch<SetStateAction<Array<AddOnInfo>>>
}

//arbitrarily chose initial dimensions for beams
const defaultWidth = 1000;
const defaultHeight = 80;

const defaultImgRestriction = 200;

const defaultColor = "red";

export function Library(props: LibraryProps) {

    const [nextX, setNextX] = useState((defaultWidth/8));
    const [nextY, setNextY] = useState((defaultHeight/8));

    const [nextAddOnX, setNextAddOnX] = useState(defaultImgRestriction/4);
    const [nextAddOnY, setNextAddOnY] = useState(defaultImgRestriction/4);

    function addBlockHandler() {
        const newBlock: Block = {
            x: nextX,
            y: nextY,
            width: defaultWidth/4,
            height: defaultHeight/4,
            angle: 0,
            color: defaultColor,
            type: "Block"
        }

        setNextX(nextX + 10);
        setNextY(nextY + 10);

        props.setCache(prevCache => {
            return prevCache.addBlock(newBlock);
        });
    }

    //tracks keys for each add-on component
    let counter = 0;

    return (
        <div className={"flex flex-col m-2 items-stretch"}>
            <div className={"self-end mt-1 mb-16 mx-1"}>
                <button
                    className={`bg-transparent hover:bg-blue-500 text-blue-700 font-bold
                    hover:text-white w-fit py-2 px-4 border border-blue-500 hover:border-transparent rounded`}
                    type="button"
                    onClick={() => props.setPopupTrigger(true)}>
                    Add Component
                </button>
            </div>
            <div className={"self-center"}>
                <button
                    className={"self-center bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-full w-fit py-1 px-4"}
                    type="button"
                    onClick={addBlockHandler}>
                    Add Beam
                </button>
            </div>
            <Beam width={defaultWidth} height={defaultHeight} color={defaultColor}/>
            {props.addOnInfo.map(addOn => {
                return <LibraryAddOn 
                        key={addOn.label}
                        info={addOn}
                        setCache={props.setCache}
                        restriction={defaultImgRestriction}
                        x={nextAddOnX}
                        y={nextAddOnY}
                        setNextX={setNextAddOnX}
                        setNextY={setNextAddOnY}
                        setAddOnInfo={props.setAddOnInfo}/>
            })}
        </div>
    );
}