import * as allAssets from '../../maps/allAssets.json' assert { type: 'json' }
import fs from 'fs';

import {
    type IXTransferTransfer,
    Version,
    type XTransferTransferInput,
    type Extrinsic,
    type TSerializedApiCall
  } from '../../types'
  import ParachainNode from '../ParachainNode'
  import XTransferTransferImpl from '../XTransferTransferImpl'
  
  class Khala extends ParachainNode implements IXTransferTransfer {
    constructor() {
      super('Khala', 'khala', 'kusama', Version.V3)
    }
  
    // transferXTokens(input: XTransferTransferInput): Extrinsic | TSerializedApiCall {
    //   const { currency, currencyID } = input
    //   const currencySelection =
    //     currencyID !== undefined ? { ForeignAsset: currencyID } : { Token: currency }
    //   return XTransferTransferImpl.transferXTokens(input, currencySelection)
    // }

    // Khala uses a pallet called xTransfer.transfer instead of xTokens.transfer
    transferXTransfer(input: XTransferTransferInput): Extrinsic | TSerializedApiCall {
        const { currency, currencyID } = input
        if(currency != "PHA"){
            throw new Error("Khala only supports PHA transfers")
        }
        let assetLocation = { 
            "id" : {
                "Concrete": {
                    "interior": {
                        "Here": "NULL"
                    }
                },
                "parents": 0
            }
        }
        // const currencySelection =
        //     currencyID !== undefined ? { ForeignAsset: currencyID } : { Token: currency }
        // const currencySelection
        return XTransferTransferImpl.transferXTransfer(input, assetLocation)
    }
  }
  
  export default Khala
  