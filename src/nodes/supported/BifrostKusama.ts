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
import { getLocalId } from '../../pallets/assets/assetsUtils'

const BIFROST_PARACHAIN_ID = 2001

class BifrostKusama extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('BifrostKusama', 'bifrost', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    // Multiple asset options need addressing
    // const currencySelection = { Native: input.currency }
    // console.log("BUILDING BIFROST TRANSFER")
    const currencySelection = getLocalId(input.currency, BIFROST_PARACHAIN_ID)
    // console.log("Currency selection: ", currencySelection)
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}

export default BifrostKusama
