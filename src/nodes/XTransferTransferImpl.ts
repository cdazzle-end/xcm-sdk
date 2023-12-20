// Contains basic structure of xTransfer call

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
    //   currencySelection: any,
      assetLocation: any,
      fees: string | number = 'Unlimited',
      pallet: TPallet = 'XTransfer'
    ): Extrinsic | TSerializedApiCall {
      const module = lowercaseFirstLetter(pallet.toString())
      let assetAndAmount = {
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
      let nullFees = null
      return api.tx[module].transfer(assetAndAmount, addressSelection, nullFees)
    }
  }
  
  export default XTransferTransferImpl
  