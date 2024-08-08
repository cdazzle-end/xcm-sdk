import type { TNode } from "../types"

export class IncompatibleNodesError extends Error {
  constructor(origin: TNode, destination: TNode) {
    super(`Transactions between nodes on different relaychains: ${origin} | ${destination}`)
    this.name = 'IncompatibleNodes'
  }
}
