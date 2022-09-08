import {Block} from '../types/uiObjects';


export function move(block: Block): Block {
    return block;
}

export function remove(block: Block): boolean {
    return false;
}

export function resize(block: Block): Block {
    return block;
}

export function rotate(current: Block): Block {
    return current;
}