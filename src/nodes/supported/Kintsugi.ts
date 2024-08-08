// Contains detailed structure of XCM call construction for Kintsugi Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Kintsugi extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Kintsugi', 'kintsugi', 'kusama', Version.V3)
  }

  // TODO Add assets to registry
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    // const currencySelection =
    //   currencyID !== undefined ? { ForeignAsset: currencyID } : { Token: currency }
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}

export default Kintsugi
