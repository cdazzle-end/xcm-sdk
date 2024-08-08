// Used to inform user, the asset object does not have a specified location in asset registry, therefore cannot transfer via xcm

import type { MyAssetRegistryObject, TNode } from "../types"

export class AssetDestinationError extends Error {
    constructor(assetObject: MyAssetRegistryObject, destination: TNode) {
      super(`No corresponding asset found on destination chain for given asset registry object: Origin chain: ${assetObject.tokenData.chain} | Asset ${assetObject.tokenData.symbol} ${assetObject.tokenData.localId} | Destination: ${destination}`)
      this.name = 'AssetDestinationError'
    }
  }
  