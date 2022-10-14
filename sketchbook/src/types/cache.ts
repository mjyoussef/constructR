import {Block, AddOn} from './uiObjects';

export type CacheEntry = {
    blocks: Array<Block>,
    addOns: Array<AddOn>
 }
 
export class SketchCache {
    cache: Array<CacheEntry>; //an array of states
    idx: number; //index of the current state in `cache`
 
    constructor(cache: Array<CacheEntry>, idx: number) {
       this.cache = cache;
       this.idx = idx;
    }
    
    /**
     * Returns the array of blocks in the CacheEntry at the current index in the cache
     * @returns the original array of blocks
     */
    getBlocks(): Array<Block> {
      if (this.idx < 0) {
         return new Array();
      }

      return this.cache[this.idx].blocks;
    }

    /**
     * Returns the array of addOns in the CacheEntry at the current index in the cache
     * @returns the original array of addOns
     */
    getAddOns(): Array<AddOn> {
      if (this.idx < 0) {
         return new Array();
      }
      
      return this.cache[this.idx].addOns;
    }

    /**
     * Inserts a CacheEntry at the index after this.idx
     * @param entry a new cache entry
     * @returns a new copy of the original SketchCache with the added CacheEntry
     */
    addEntry(entry: CacheEntry): SketchCache {
       const newCacheEntries: Array<CacheEntry> = new Array(this.idx+2);
       newCacheEntries[this.idx+1] = entry; //new entry is added after the current state
 
       for (let i=0; i<=this.idx; i++) {
          newCacheEntries[i] = this.cache[i];
       }
 
       return new SketchCache(newCacheEntries, this.idx+1);
    }


    /**
     * Creates a new CacheEntry (from the current CacheEntry) and adds a new block
     * @param block a new block that is to be added to the current entry's array of blocks
     * @returns a new SketchCache
     */
    addBlock(block: Block): SketchCache {
      let newEntry: CacheEntry = {
         blocks: new Array(block),
         addOns: new Array()
      }

      if (this.idx > -1) {
         const currentEntry: CacheEntry = this.cache[this.idx];

         // add the block to a copy of the current state
         newEntry = {
            blocks: [...currentEntry.blocks, block],
            addOns: currentEntry.addOns
           }
      }

      return this.addEntry(newEntry);
    }
 
    /**
     * Creates a new CacheEntry (from the current CacheEntry) and adds a new addOn
     * @param addOn a new addOn that is to be added to the current entry's array of addOns
     * @returns a new SketchCache
     */
    addAddOn(addOn: AddOn): SketchCache {
      let newEntry: CacheEntry = {
         blocks: new Array(),
         addOns: new Array(addOn)
      }

      if (this.idx > -1) {
         const currentEntry: CacheEntry = this.cache[this.idx];

         // add the addOn to a copy of the current state
         newEntry = {
            blocks: currentEntry.blocks,
            addOns: [...currentEntry.addOns, addOn]
         }
      }

       return this.addEntry(newEntry);
    }
}