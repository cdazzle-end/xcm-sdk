// Contains detailed structure of XCM call construction for Pioneer Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Pioneer extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Pioneer', 'pioneer', 'kusama', Version.V1)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    // Multiple asset options needs addressing
    const [assetType, assetValue] = determineAssetType(input.currencyID)
    const formattedAssetParameter = {
      [assetType]: assetValue
    }
    return XTokensTransferImpl.transferXTokens(input, formattedAssetParameter, input.fees)
  }
}

// There are other asset types, but none are used currently
function determineAssetType(localId: any): [string, string] {
  if ('NativeAsset' in localId) return ['NativeAsset', localId.NativeAsset]
  throw new Error('Unknown asset type');
}
export default Pioneer
