// Contains basic structure of xTransfer call, only Khala and Phala

import {
    type Extrinsic,
    type TPallet,
    type TSerializedApiCall,
    type XTransferTransferInput
  } from '../types'
  import { lowercaseFirstLetter } from '../utils'
  
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class XTransferTransferImpl {
    static transferXTransfer(
      { api, amount, addressSelection, serializedApiCallEnabled }: XTransferTransferInput,
      assetLocation: any,
      fees: string | number = 'Unlimited',
      pallet: TPallet = 'XTransfer'
    ): Extrinsic | TSerializedApiCall {
      const module = lowercaseFirstLetter(pallet.toString())
      const assetAndAmount = {
        assetLocation,
        "fun": {
          "Fungible": amount
        }
      }
      if (serializedApiCallEnabled === true) {
        return {
          module,
          section: 'transfer',
          parameters: [assetAndAmount, addressSelection]
        }
      }
      const nullFees = null
      return api.tx[module].transfer(assetAndAmount, addressSelection, nullFees)
    }
  }
  
  export default XTransferTransferImpl
  