// Contains detailed structure of XCM call construction for Unique Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

// TODO Add unique assets to registry
class Unique extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Unique', 'unique', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    if(currencyID !== '0') throw new Error(`Unique XCM not configured for ${currencyID}`)
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}

export default Unique
