// Contains detailed structure of XCM call construction for Bajun Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Bajun extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Bajun', 'bajun', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    if(currencyID !== 'BAJU') throw new Error(`Bajun currencyID error ${currencyID}`)
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}

export default Bajun
