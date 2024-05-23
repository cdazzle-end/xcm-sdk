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


  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    // console.log("PARALLEL transferXTokens")
    let xtransfer = XTokensTransferImpl.transferXTokens(input, input.currencyID)
    // console.log("PARALLEL transferXTokens: " + JSON.stringify(xtransfer))
    return xtransfer
  }
}

export default Parallel
