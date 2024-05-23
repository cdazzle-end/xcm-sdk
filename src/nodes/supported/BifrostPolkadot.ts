// Contains detailed structure of XCM call construction for Bifrost Parachain on Polkadot

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import { getLocalId } from '../../pallets/assets/assetsUtils'
import XTokensTransferImpl from '../XTokensTransferImpl'

const BIFROST_PARACHAIN_ID = 2030

export class BifrostPolkadot extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('BifrostPolkadot', 'bifrost', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    // const currencySelection = { [input.currency === 'BNC' ? 'Native' : 'Token']: input.currency }
    const currencySelection = getLocalId(input.currency, BIFROST_PARACHAIN_ID, "Polkadot")
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}
