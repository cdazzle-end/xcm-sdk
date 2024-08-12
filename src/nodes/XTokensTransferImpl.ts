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
    currencyMultiasset: any,
    feeMultiasset: any,
    fees: string | number = 'Unlimited',
    pallet: TPallet = 'XTokens'
  ): Extrinsic | TSerializedApiCall {
    const module = lowercaseFirstLetter(pallet.toString())

    console.log(`XTokensTransferMultiassets parameters ${module} | CurrencyID: ${JSON.stringify(currencyMultiasset)} | Amount: ${amount} | Address: ${JSON.stringify(addressSelection)} | fees: ${fees}`)

    const feeIndex = 1;
    const assets = [currencyMultiasset, feeMultiasset]
    // console.log(`Serialized API Call Enabled: ${serializedApiCallEnabled}`)
    if (serializedApiCallEnabled === true) {
      return {
        module,
        section: 'transferMultiassets',
        parameters: [assets, feeIndex, addressSelection, fees]
      }
    }

    return api.tx[module].transferMultiassets(assets, feeIndex, addressSelection, fees)
  }
  
}

export default XTokensTransferImpl
