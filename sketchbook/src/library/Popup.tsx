import React, { useState, Dispatch, SetStateAction } from 'react';


type PopupProps = {
    trigger: boolean,
    setPopupTrigger: Dispatch<SetStateAction<boolean>>
}

export function Popup(props: React.PropsWithChildren<PopupProps>) {

    const [componentName, setComponentName] = useState("");

    return (props.trigger) ? ( 
        <div className={"fixed bg-slate-800 bg-opacity-50 w-screen h-screen flex justify-center"}>
            <div className={"relative bg-white w-1/3 h-1/3 m-20 rounded-lg flex flex-col items-stretch"}>
                <button 
                    className={`self-end absolute bg-white hover:bg-gray-100
                    text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow m-3`}
                    onClick={() => props.setPopupTrigger(false)}>
                    Close
                </button>
                <div className={"self-start flex flex-col place-items-start mt-20 mx-8"}>
                    <form className={"mb-4"}>
                        <label>
                            <p className={"font-sans font-normal text-lg"}> Create a name for your component: </p>
                            <textarea 
                                className={"w-full h-2/5 p-2 mt-2 resize-none border-2 border-gray-600 border-solid rounded bg-slate-50"}
                                value={componentName}
                                onChange={(event) => setComponentName(event.target.value)}/>
                        </label>
                    </form>
                    <input type="file" onChange={(event) => {
                        if (event.target.files !== null) {
                            console.log(event.target.files[0]);
                        }
                    }}/>
                </div>
            </div>
        </div>
    ) : null;
}