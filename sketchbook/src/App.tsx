import React, {useState} from 'react';
import './App.css';
import {Block, AddOn} from './types/uiObjects';
import { CacheEntry, SketchCache } from './types/cache';
import {Library} from './library/Library';
import {Page} from './sketchpad/Page';
import {Popup} from './library/Popup';

function App() {

  const [libraryAddOns, setLibraryAddOns] = useState(new Array<AddOn>());

  const [popupTrigger, setPopupTrigger] = useState(false);

  const [cache, setCache] = useState(new SketchCache(new Array<CacheEntry>(), -1));

  return (
    <div className="w-screen h-screen flex flex-row grid grid-cols-5">
      <Popup trigger={popupTrigger} setPopupTrigger={setPopupTrigger} setLibraryAddOns={setLibraryAddOns} />
      <div className="flex flex-col justify-start h-11/12 col-span-1 border-solid border-2 border-black m-2">
        <Library
          setCache={setCache}
          setPopupTrigger={setPopupTrigger}
          libraryAddOns={libraryAddOns}/>
      </div>
      <div className="h-11/12 col-span-4 border-solid border-2 border-black m-2">
        <Page
          cache={cache}
          setCache={setCache}/>
      </div>
    </div>
  );
}

export default App;
