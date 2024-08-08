// Used to inform user, the asset object does not have a specified location in asset registry, therefore cannot transfer via xcm

import type { MyAssetRegistryObject, TNode } from "../types"

export class AssetNotXcmTransferrableError extends Error {
    constructor(node: TNode, assetObject: MyAssetRegistryObject) {
      super(`Asset has no multi-location, not xcm transferrable: Node ${node} | Symbol ${assetObject.tokenData.symbol} | ID ${assetObject.tokenData.localId}`)
      this.name = 'AssetNotXcmTransferrable'
    }
  }
  