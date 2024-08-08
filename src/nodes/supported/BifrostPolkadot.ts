// Contains detailed structure of XCM call construction for Bifrost Parachain on Polkadot

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
// import { getAssetRegistryObject, getLocalId } from '../../pallets/assets/assetsUtils'
import XTokensTransferImpl from '../XTokensTransferImpl'

// const BIFROST_PARACHAIN_ID = 2030

export class BifrostPolkadot extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('BifrostPolkadot', 'bifrostPolkadot', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    return XTokensTransferImpl.transferXTokens(input, input.currencyID)
  }
}
