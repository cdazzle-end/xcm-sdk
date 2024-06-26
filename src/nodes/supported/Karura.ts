// Contains detailed structure of XCM call construction for Karura Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import { getAllNodeProviders } from '../../utils'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Karura extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Karura', 'karura', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    let { currency, currencyID } = input

    //Convert KUSD tokens appropriately
    if(currency && currency.toUpperCase() == "AUSD" || currency?.toUpperCase() == "ASEED") {
      currency = "KUSD"
    }

    const currencySelection =
      currencyID !== undefined ? { ForeignAsset: currencyID } : { Token: currency }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }

  getProvider(): string {
    // Return the second WebSocket URL because the first one is sometimes unreliable.
    return getAllNodeProviders(this.node)[1]
  }
}

export default Karura
