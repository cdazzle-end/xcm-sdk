// Contains detailed structure of XCM call construction for Bifrost Parachain on Kusama

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class BifrostKusama extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('BifrostKusama', 'bifrostKusama', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    return XTokensTransferImpl.transferXTokens(input, input.currencyID)
  }
}

export default BifrostKusama
