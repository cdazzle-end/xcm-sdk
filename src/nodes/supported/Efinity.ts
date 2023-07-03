// Contains detailed structure of XCM call construction for Efinity Parachain

import { IXTokensTransfer, Version, XTokensTransferInput } from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Efinity extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Efinity', 'efinity', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput) {
    const currencySelection = { currencyId: [0, input.currencyID] }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}

export default Efinity