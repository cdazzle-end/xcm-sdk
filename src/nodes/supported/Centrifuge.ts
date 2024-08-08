// Contains detailed structure of XCM call construction for Centrifuge Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

// Centrifuge Asset types - ormlAssetRegistry

// TODO add full cfg registry to local registry
export class Centrifuge extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Centrifuge', 'centrifuge', 'polkadot', Version.V3)
  }

  // ormlAssetRegistry types === xTokenTransfer types. CurrencyId is formatted already
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    // const currencySelection = currency === 'CFG' ? 'Native' : { ForeignAsset: currencyID }
    return XTokensTransferImpl.transferXTokens(input, currencyID)
  }
}
