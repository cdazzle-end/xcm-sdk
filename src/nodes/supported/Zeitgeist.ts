// Contains detailed structure of XCM call construction for Zeitgeist Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

// TODO Add Zeitgeist assets to registry
class Zeitgeist extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Zeitgeist', 'zeitgeist', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const currencySelection = input.currencyID === 'ZTG' ? 'Ztg' : { ForeignAsset: input.currencyID }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}

export default Zeitgeist
