// Contains detailed structure of XCM call construction for Parallel Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Parallel extends ParachainNode implements IXTokensTransfer {
  constructor() {
    // super('Parallel', 'parallel', 'polkadot', Version.V1)
    super('Parallel', 'parallel', 'polkadot', Version.V3) // Changed to V3
  }

  // XTokens input === localId
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    // console.log("PARALLEL transferXTokens")
    return XTokensTransferImpl.transferXTokens(input, input.currencyID)
  }
}

export default Parallel
