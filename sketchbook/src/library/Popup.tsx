import React, { Dispatch, SetStateAction } from 'react';


type PopupProps = {
    trigger: boolean,
    setPopupTrigger: Dispatch<SetStateAction<boolean>>
}

export function Popup(props: React.PropsWithChildren<PopupProps>) {
    return (props.trigger) ? ( 
        <div className={"fixed bg-slate-800 bg-opacity-50 w-screen h-screen flex justify-center"}>
            <div className={"relative bg-white w-2/3 h-2/3 m-20 flex justify-end"}>
                <button 
                    className={`absolute bg-white hover:bg-gray-100
                    text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow m-2`}
                    onClick={() => props.setPopupTrigger(false)}>
                    Close
                </button>
                {props.children}
            </div>
        </div>
    ) : null;
}