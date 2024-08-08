// Contains detailed structure of XCM call construction for ComposableFinance Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

// TODO add composable to asset registry
class ComposableFinance extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('ComposableFinance', 'composable', 'polkadot', Version.V3)
  }

  // XTokens input === localId
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}

export default ComposableFinance
