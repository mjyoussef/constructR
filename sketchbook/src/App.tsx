import React, {useState, useRef} from 'react';
import './App.css';
import {Block} from './types/uiObjects';
import {Library} from './library/Library';
import {Sketch} from './sketchpad/Sketch';

function App() {

  const [blocks, setBlocks] = useState(new Array<Block>());

  console.log(blocks);

  return (
    <div className="w-screen h-screen flex flex-row grid grid-cols-5">
      <div className="flex flex-col justify-start h-11/12 col-span-1 border-solid border-2 border-black m-2">
        <Library setBlocks={setBlocks}/>
      </div>
      <div className="h-11/12 col-span-4 border-solid border-2 border-black m-2">
        <Sketch blocks={blocks} setBlocks={setBlocks}/>
      </div>
    </div>
  );
}

export default App;
