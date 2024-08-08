// Contains detailed structure of XCM call construction for Imbue Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Imbue extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Imbue', 'imbue', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    if ( currencyID !== 'Native') throw new Error(`${this.node} does not support ${currencyID}`)
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}

export default Imbue
