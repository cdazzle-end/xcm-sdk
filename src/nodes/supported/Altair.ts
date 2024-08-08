// Contains detailed structure of XCM call construction for Altair Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

// TODO Add altair assets to registry
class Altair extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Altair', 'altair', 'kusama', Version.V3)
  }

  // private static getCurrencySelection({ currency, currencyID }: XTokensTransferInput): any {
  //   if (currencyID === 'AIR') return 'Native'
  //   if (currency === 'KSM') return currency
  //   return { ForeignAsset: currencyID }
  // }

  // XToken input === local id
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    return XTokensTransferImpl.transferXTokens(input, input.currencyID)
  }
}

export default Altair
