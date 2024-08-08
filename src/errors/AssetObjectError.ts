// Used to inform user, the asset object does not exist for the specified node and asset id

import type { TNode } from "../types"

export class AssetObjectNotFoundError extends Error {
    constructor(node: TNode, assetId: string) {
      super(`No asset object found in registry for ${node} | ${assetId}`)
      this.name = 'AssetObjectNotFound'
    }
  }
  