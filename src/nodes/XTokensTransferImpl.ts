// Contains basic structure of xToken call

import {
  type Extrinsic,
  type TPallet,
  type TSerializedApiCall,
  type XTokensTransferInput
} from '../types'
import { lowercaseFirstLetter } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class XTokensTransferImpl {
  // Doesn't use currency asset/if from XTokensTransferInput.
  // Need to format currency input param from parachain node
  static transferXTokens(
    { api, amount, addressSelection, serializedApiCallEnabled }: XTokensTransferInput,
    currencySelection: any,
    fees: string | number = 'Unlimited',
    pallet: TPallet = 'XTokens'
  ): Extrinsic | TSerializedApiCall {
    const module = lowercaseFirstLetter(pallet.toString())

    console.log(`XTokensTransfer parameters ${module} | CurrencyID: ${JSON.stringify(currencySelection)} | Amount: ${amount} | Address: ${JSON.stringify(addressSelection)} | fees: ${fees}`)

    // console.log(`Serialized API Call Enabled: ${serializedApiCallEnabled}`)
    if (serializedApiCallEnabled === true) {
      return {
        module,
        section: 'transfer',
        parameters: [currencySelection, amount, addressSelection, fees]
      }
    }

    return api.tx[module].transfer(currencySelection, amount, addressSelection, fees)
  }

  // Transfers asset <currencySelection> and asset <feeCurrencyId>.
  // Currently only for Hydra -> Asset Hub Polkadot
  // Params:
  // 1) Multiassets
  // 2) Fee item
  // 3) Destination (Parachain and Account)
  // 4) Destination weight limit ('Unlimited')
  static transferXTokensMultiassets(
    { api, amount, addressSelection, serializedApiCallEnabled }: XTokensTransferInput,
    multiAssets: any,
    fees: string | number = 'Unlimited',
    pallet: TPallet = 'XTokens'
  ): Extrinsic | TSerializedApiCall {
    const module = lowercaseFirstLetter(pallet.toString())

    console.log(`XTokensTransferMultiassets parameters ${module} | transferMultiassets`)
    const feeIndex = 1;
    
    console.log(`Params assets: ${JSON.stringify(multiAssets, null, 2)} | feeIndex: ${feeIndex} | addressSelection: ${JSON.stringify(addressSelection, null, 2)} | fees: ${fees}`)
    // console.log(`Serialized API Call Enabled: ${serializedApiCallEnabled}`)
    if (serializedApiCallEnabled === true) {
      return {
        module,
        section: 'transferMultiassets',
        parameters: [multiAssets, feeIndex, addressSelection, fees]
      }
    }

    return api.tx[module].transferMultiassets(multiAssets, feeIndex, addressSelection, fees)
  }
  
}

export default XTokensTransferImpl
