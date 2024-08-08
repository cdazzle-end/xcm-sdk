// Phala/Khala uses a pallet called xTransfer.transfer instead of xTokens.transfer
// Currently only set to support native token transfer because no reason for other tokens to be on the chain
// but XTransfer does support the other assets. Just need to use locations as asset params


// import * as allAssets from '../../maps/allAssets.json' assert { type: 'json' }
// import fs from 'fs';

import {
    type IXTransferTransfer,
    Version,
    type XTransferTransferInput,
    type Extrinsic,
    type TSerializedApiCall
  } from '../../types'
  import ParachainNode from '../ParachainNode'
  import XTransferTransferImpl from '../XTransferTransferImpl'
  
  class Phala extends ParachainNode implements IXTransferTransfer {
    constructor() {
      super('Phala', 'phala', 'polkadot', Version.V3)
    }
  
    // transferXTokens(input: XTransferTransferInput): Extrinsic | TSerializedApiCall {
    //   const { currency, currencyID } = input
    //   const currencySelection =
    //     currencyID !== undefined ? { ForeignAsset: currencyID } : { Token: currency }
    //   return XTransferTransferImpl.transferXTokens(input, currencySelection)
    // }


    // TODO Add support for other assets
    transferXTransfer(input: XTransferTransferInput): Extrinsic | TSerializedApiCall {
        const { currencyID } = input
        if(currencyID !== "PHA"){
            throw new Error(`Phala doesn't support xcm transfer of ${currencyID}`)
        }
        const assetLocation = { 
            "id" : {
                "Concrete": {
                    "interior": {
                        "Here": "NULL"
                    }
                },
                "parents": 0
            }
        }
        return XTransferTransferImpl.transferXTransfer(input, assetLocation)
    }
  }
  
  export default Phala
  