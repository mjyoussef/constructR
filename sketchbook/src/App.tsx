import React, {useState} from 'react';
import './App.css';
import {Block, AddOn} from './types/uiObjects';
import {Library} from './library/Library';
import {Page} from './sketchpad/Page';
import {Popup} from './library/Popup';

function App() {

  // blocks are the only built-in drag-and-drop component in the library
  const [blocks, setBlocks] = useState(new Array<Block>());

  const [addOns, setAddOns] = useState(new Array<AddOn>());

  const [libraryAddOns, setLibraryAddOns] = useState(new Array<AddOn>());

  const [popupTrigger, setPopupTrigger] = useState(false);

  console.log(libraryAddOns);

  return (
    <div className="w-screen h-screen flex flex-row grid grid-cols-5">
      <Popup trigger={popupTrigger} setPopupTrigger={setPopupTrigger} setLibraryAddOns={setLibraryAddOns}>
      </Popup>
      <div className="flex flex-col justify-start h-11/12 col-span-1 border-solid border-2 border-black m-2">
        <Library setBlocks={setBlocks} setAddOns={setAddOns} setPopupTrigger={setPopupTrigger} libraryAddOns={libraryAddOns}/>
      </div>
      <div className="h-11/12 col-span-4 border-solid border-2 border-black m-2">
        <Page blocks={blocks} setBlocks={setBlocks} addOns={addOns} setAddOns={setAddOns}/>
      </div>
    </div>
  );
}

export default App;
