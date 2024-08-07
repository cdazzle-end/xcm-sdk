// Contains detailed structure of XCM call construction for HydraDX Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class HydraDX extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('HydraDX', 'hydradx', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    // console.log(`HydraDX transferXTokens input currency: ${JSON.stringify(input.currency)}`)
    // console.log(`HydraDX transferXTokens input currencyId: ${JSON.stringify(input.currencyID)}`)
    
    const { currencyID } = input
    // console.log(`HydraDX transferXTokens currencyID: ${currencyID}`)
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}

export default HydraDX
