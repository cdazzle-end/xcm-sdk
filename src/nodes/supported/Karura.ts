// Contains detailed structure of XCM call construction for Karura Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import { getAllNodeProviders } from '../../utils'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

type KaruraAssetType = 'Erc20' | 'Token' | 'LiquidCrowdloan' | 'StableAssetPoolToken' | 'ForeignAsset';
class Karura extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Karura', 'karura', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input

    let [acalaAssetType, assetValue] = determineAssetType(currencyID)
    if(acalaAssetType === 'StableAssetPoolToken' || acalaAssetType === 'Erc20'){
      throw new Error(`Acala not configured to xcm transfer stable pool token or erc20. ${JSON.stringify(currencyID)}`)
    }
    
    // Convert KUSD tokens appropriately
    if(assetValue?.toUpperCase() === "AUSD" || assetValue?.toUpperCase() === "ASEED") {
      assetValue = "KUSD"
    }
    const formattedAssetParameter = {
      [acalaAssetType]: assetValue
    }

    return XTokensTransferImpl.transferXTokens(input, formattedAssetParameter)
  }

  getProvider(): string {
    // Return the second WebSocket URL because the first one is sometimes unreliable.
    return getAllNodeProviders(this.node)[1]
  }
}

// Karura asset id's are formatted differently than the actual name of the asset type used in function params
function determineAssetType(localId: any): [KaruraAssetType, string] {
  if ('NativeAssetId' in localId) {
    if (localId.NativeAssetId !== undefined && 'Token' in localId.NativeAssetId) return ['Token', localId.NativeAssetId.Token];
    if (localId.NativeAssetId !== undefined && 'LiquidCrowdloan' in localId.NativeAssetId) return ['LiquidCrowdloan', localId.NativeAssetId.LiquidCrowdloan];
  }
  if ('ForeignAssetId' in localId) return ['ForeignAsset', localId.ForeignAssetId];
  if ('StableAssetId' in localId) return ['StableAssetPoolToken', localId.StableAssetId];
  if ('Erc20' in localId) return ['Erc20', localId.Erc20];

  throw new Error('Unknown asset type');
}

export default Karura
