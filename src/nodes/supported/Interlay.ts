// Contains detailed structure of XCM call construction for Interlay Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Interlay extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Interlay', 'interlay', 'polkadot', Version.V3)
  }

  // TODO Add assets to registry
  // XToken input === localID
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    // const currencySelection =
    //   currencyID !== undefined ? { ForeignAsset: currencyID } : { Token: currency }
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}

export default Interlay
